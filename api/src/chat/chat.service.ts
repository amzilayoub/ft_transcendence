import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, room_user_rel } from '@prisma/client';

@Injectable()
export class ChatService {
    constructor(private prismaService: PrismaService) {}

    async createMessage(room_id: number, user_id: number, message: string) {
        await this.prismaService.$queryRaw(Prisma.sql`
			UPDATE room
			SET count_messages = count_messages + 1,
			updated_at = NOW()
			WHERE id = ${room_id}`);

        return this.prismaService.messages.create({
            data: {
                room_id,
                user_id,
                message,
            },
        });
    }

    createRoom(user, roomTypeId: number) {
        return this.prismaService.room.create({
            data: {
                owner_id: user.id,
                room_type_id: roomTypeId,
            },
        });
    }

    joinRoom(roomId: number, userId: number) {
        return this.prismaService.room_user_rel.create({
            data: {
                room_id: roomId,
                user_id: userId,
            },
        });
    }

    /*
     ** Get all rooms that the current user has been joined
     */
    getUserRooms(
        userId: number,
        roomId = -1,
        roomName = '',
    ): Promise<Array<any>> {
        let specificRoom: string =
            roomId == -1 ? '' : `AND receiver.room_id = ${roomId}`;
        if (roomName != '')
            specificRoom = `AND (CASE
								WHEN room_type.type = 'dm'
									THEN users.username
								ELSE
								--Here I should return the name of the room
									'shared room'
							END) LIKE '%${roomName}%'`;
        const query = `
			(
				SELECT receiver.id, receiver.room_id, receiver.updated_at AS "lastMessageTime", room_type.type,
				users.id as user_id,
				users.avatar_url,
				(
					SELECT message
					FROM messages
					WHERE room_id = receiver.room_id
					ORDER BY id DESC
					LIMIT 1
				) AS "lastMessage",
				CASE
					WHEN
					(SELECT COUNT(*)
					FROM blacklist
					WHERE sender.user_id = blacklist.user_id
					AND receiver.user_id = blacklist.blocked_user_id) > 0
						THEN true
					ELSE
						false
				END AS "is_blocked",
				CASE
					WHEN
					(SELECT COUNT(*)
					FROM blacklist
					WHERE sender.user_id = blacklist.blocked_user_id
					AND receiver.user_id = blacklist.user_id ) > 0
						THEN true
					ELSE
						false
				END AS "am_i_blocked",
				sender.unread_message_count AS "unreadMessagesCount",
				room.updated_at AS "last_message_time",
				users.username AS name,
				users.id AS user_id
				FROM room_user_rel as sender, room_user_rel as receiver, room, room_type, users
				-- here is inner join
				WHERE sender.room_id = room.id
				AND room.room_type_id = room_type.id
				AND users.id = receiver.user_id
				-- Here is a self join
				AND sender.room_id = receiver.room_id
				AND sender.user_id != receiver.user_id
				AND room_type.type = 'dm'
				AND sender.user_id = ${userId}
				${specificRoom}
				ORDER BY room.updated_at DESC
			)
			UNION
			(
			SELECT receiver.id, receiver.room_id, receiver.updated_at AS "lastMessageTime", room_type.type,
			users.id as user_id,
			users.avatar_url,
			(
				SELECT message
				FROM messages
				WHERE room_id = receiver.room_id
				ORDER BY id DESC
				LIMIT 1
			) AS "lastMessage",
			false AS "is_blocked",
			false AS "am_i_blocked",
			receiver.unread_message_count AS "unreadMessagesCount",
			room.updated_at AS "last_message_time",
			(	SELECT room_details.name
				FROM room_details
				WHERE room.id = room_details.room_id
				)
			AS name,
			-1 AS user_id
			FROM room_user_rel as receiver, room, room_type, users
			-- here is inner join
			WHERE receiver.room_id = room.id
			AND room.room_type_id = room_type.id
			AND users.id = receiver.user_id
			AND room_type.type != 'dm'
			AND receiver.user_id = ${userId}
			${specificRoom}
			ORDER BY room.updated_at DESC
			)

		`;
        return this.prismaService.$queryRaw(Prisma.raw(query));
    }

    findRoomBetweenUsers(currentUserId: number, targetUserId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
			SELECT u1.*
			FROM room_user_rel as u1, room_user_rel as u2, room, room_type
			WHERE u1.room_id = room.id AND u2.room_id = room.id
			AND room.room_type_id = room_type.id
			AND room_type.type = 'dm'
			AND u1.user_id = ${currentUserId}
			AND u2.user_id = ${targetUserId}
			AND u1.room_id = u2.room_id
		`);
    }

    getRoomInfo(roomId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
			SELECT room_details.name, room_type.type
			FROM room
			INNER JOIN room_details ON room.id = room_details.room_id
			INNER JOIN room_type ON room_type.id = room.room_type_id
			WHERE room.id = ${roomId}		
		`);
    }

    createRoomRule(roomeId: number, rule?: string) {}

    getRoomType(name: string) {
        return this.prismaService.room_type.findFirst({
            where: {
                type: name,
            },
        });
    }

    getRoomTypeById(id: number) {
        return this.prismaService.room_type.findFirst({
            where: {
                id,
            },
        });
    }

    getRoomMembers(roomId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
				SELECT users.id, users.username AS username, users.avatar_url
				FROM room_user_rel
				INNER JOIN users ON users.id = room_user_rel.user_id
				WHERE room_user_rel.room_id = ${roomId}
		`);
    }

    getRoomMessages(roomId: number, userId = -1) {
        return this.prismaService.$queryRaw(Prisma.sql`
				SELECT id, user_id AS "senderId", message, created_at as time,
					CASE
						WHEN user_id = ${userId}
							THEN true
						ELSE
							false
					END AS "isMe"
				FROM messages
				WHERE room_id = ${roomId}
				ORDER BY id ASC
		`);
    }

    exploreRooms(roomName: string, userId: number) {
        let query = `%${roomName}%`;
        if (query == '') query = '%%';
        return this.prismaService.$queryRaw(Prisma.sql`
					SELECT DISTINCT room.id, room_details.name, room_details.avatar_url,
					CASE
					WHEN (
							SELECT COUNT(*)
							 FROM room_user_rel
							  WHERE room_user_rel.user_id = ${userId}
							AND room_user_rel.room_id = room.id
						 ) > 0
						THEN true
					ELSE
						false
				END AS "am_i_member"
					FROM room
					INNER JOIN room_details ON room_details.room_id = room.id
					INNER JOIN room_type ON room_type.id = room.room_type_id
					WHERE room_type.type != 'private'
					AND room_details.name LIKE ${query}`);
    }

    getAllRoomType() {
        return this.prismaService.room_type.findMany({
            where: {
                type: {
                    not: 'dm',
                },
            },
        });
    }

    createRoomName(roomId: number, name: string) {
        return this.prismaService.room_details.create({
            data: {
                room_id: roomId,
                name,
            },
        });
    }

    setRoomUnread(roomId: number, senderUserId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
			UPDATE room_user_rel
			SET unread_message_count = unread_message_count + 1
			WHERE room_id = ${roomId}
			AND user_id != ${senderUserId}
		`);
    }

    setRoomAsRead(roomId: number, userId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
			UPDATE room_user_rel
			SET unread_message_count = 0
			WHERE room_id = ${roomId}
			AND user_id = ${userId}
		`);
    }

    isJoined(userId: number, roomId: number): Promise<room_user_rel[]> {
        return this.prismaService.$queryRaw(Prisma.sql`
			SELECT *
			FROM room_user_rel
			WHERE user_id = ${userId}
			AND room_id = ${roomId}
		`);
    }
}
