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
            roomId == -1 ? '' : `WHERE room_id = ${roomId}`;
        if (roomName != '') {
            if (specificRoom == '')
                specificRoom = `WHERE name LIKE '%${roomName}%'`;
            else specificRoom = `AND name LIKE '%${roomName}%'`;
        }
        const query = `
			SELECT *, 'offline' AS "userStatus"
			FROM (
				(
					SELECT receiver.id, receiver.room_id, room.updated_at AS "lastMessageTime", room_type.type, room.created_at AS "created_at",
					users.avatar_url,
					(
                        SELECT users.avatar_url
                        FROM users
                        WHERE sender.user_id = users.id
                        LIMIT 1
                    ) AS "senderAvatarUrl",
                    (
                        SELECT users.username
                        FROM users
                        WHERE sender.user_id = users.id
                        LIMIT 1
                    ) AS "senderUsername",
					(
						SELECT message
						FROM messages
						WHERE room_id = receiver.room_id
						AND receiver.user_id NOT IN (
							SELECT blacklist.user_id
							FROM blacklist
							WHERE blacklist.blocked_user_id = messages.user_id
						)
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
					END AS "isBlocked",
					CASE
						WHEN
						(SELECT COUNT(*)
						FROM blacklist
						WHERE sender.user_id = blacklist.blocked_user_id
						AND receiver.user_id = blacklist.user_id ) > 0
							THEN true
						ELSE
							false
					END AS "amIBlocked",
					sender.unread_message_count AS "unreadMessagesCount",
					users.username AS name,
					users.id AS user_id,
					receiver.muted
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
					AND receiver.banned = false
				)
				UNION
				(
				SELECT receiver.id, receiver.room_id, room.updated_at AS "lastMessageTime", room_type.type, room.created_at AS "created_at",
				users.avatar_url,
				'' AS "senderAvatarUrl",
				'' AS "senderUsername",
				(	SELECT room_details.avatar_url
					FROM room_details
					WHERE room.id = room_details.room_id
				) AS "avatar_url",
				(
					SELECT message
					FROM messages
					WHERE room_id = receiver.room_id
					AND receiver.user_id NOT IN (
						SELECT blacklist.user_id
						FROM blacklist
						WHERE blacklist.blocked_user_id = messages.user_id
					)
					ORDER BY id DESC
					LIMIT 1
				) AS "lastMessage",
				false AS "isBlocked",
				false AS "amIBlocked",
				receiver.unread_message_count AS "unreadMessagesCount",
				(	SELECT room_details.name
					FROM room_details
					WHERE room.id = room_details.room_id
				)
				AS name,
				-1 AS user_id,
				receiver.muted
				FROM room_user_rel as receiver, room, room_type, users
				-- here is inner join
				WHERE receiver.room_id = room.id
				AND room.room_type_id = room_type.id
				AND users.id = receiver.user_id
				AND room_type.type != 'dm'
				AND receiver.user_id = ${userId}
				AND receiver.banned = false
				)
			) AS tbl
			${specificRoom}
			ORDER BY "lastMessageTime" DESC
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

    isThisUserBlocked(userId: number, roomId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
			SELECT *
			FROM blacklist
			WHERE (
				SELECT COUNT(*)
				FROM room_user_rel
				INNER JOIN room ON room.id = room_user_rel.room_id
				INNER JOIN room_type ON room_type.id = room.room_type_id
				AND room_type.type = 'dm'
				AND room.id = ${roomId}
				AND room_user_rel.user_id IN (${userId})
				AND (blacklist.user_id = ${userId} OR blacklist.blocked_user_id = ${userId})
			) > 0
		`);
    }

    getRoomInfo(roomId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
			SELECT room_details.name, room_type.type, room.owner_id,
				(
					SELECT room_rules.rule
					FROM room_rules
					WHERE room.id = room_rules.room_id
				) AS "rule"
			FROM room
			INNER JOIN room_details ON room.id = room_details.room_id
			INNER JOIN room_type ON room_type.id = room.room_type_id
			WHERE room.id = ${roomId}
		`);
    }

    getDmRoomInfo(roomId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
			SELECT room_type.type,
				(
					SELECT room_rules.rule
					FROM room_rules
					WHERE room.id = room_rules.room_id
				) AS "rule"
			FROM room
			INNER JOIN room_type ON room_type.id = room.room_type_id
			WHERE room.id = ${roomId}
		`);
    }

    createRoomRule(roomeId: number, rule?: string) {
        return this.prismaService.room_rules.create({
            data: {
                room_id: roomeId,
                rule,
            },
        });
    }

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

    getRoomMembers(roomId: number, userId: number, username?: string) {
        let additionalCond = '';
        if (username)
            additionalCond = `AND users.username LIKE '%${username}%'`;

        const query = `
			-- Here we get first the owner
			(
				SELECT users.id, users.username AS username, users.avatar_url,
						'Owner' AS "membershipStatus",room_user_rel.banned AS "isBanned",
						room_user_rel.muted AS "isMuted",
						CASE
							WHEN users.id = ${userId}
								THEN true
							ELSE
								false
						END AS "isMe"
				FROM room_user_rel
				INNER JOIN room ON room.id = room_user_rel.room_id
				INNER JOIN users ON users.id = room_user_rel.user_id
				WHERE room_user_rel.room_id = ${roomId}
				AND room.owner_id = room_user_rel.user_id
				${additionalCond}
			)
			-- then we get the other member and sort them by role
			-- we do this because if we sort all the record by role
			-- the result will be as follow: [admin, member, owner]
			-- but wa want it in this order [owner, admin, member]
			UNION
			(
				SELECT users.id, users.username AS username, users.avatar_url,
						room_user_rel.role AS "membershipStatus",
						room_user_rel.banned AS "isBanned",
						room_user_rel.muted AS "isMuted",
						CASE
							WHEN users.id = ${userId}
								THEN true
							ELSE
								false
						END AS "isMe"
				FROM room_user_rel
				INNER JOIN room ON room.id = room_user_rel.room_id
				INNER JOIN users ON users.id = room_user_rel.user_id
				WHERE room_user_rel.room_id = ${roomId}
				AND room.owner_id != room_user_rel.user_id
				${additionalCond}
				ORDER BY room_user_rel.role ASC
			)
			UNION
			(
				SELECT users.id, users.username AS username, users.avatar_url,
						'User' AS "membershipStatus",
						false AS "isBanned",
						false AS "isMuted",
						false AS "isMe"
				FROM users
				WHERE id NOT IN (
					SELECT room_user_rel.user_id
					FROM room_user_rel
					WHERE room_user_rel.room_id = ${roomId}
				)
				${additionalCond}
			)
			`;
        return this.prismaService.$queryRaw(Prisma.raw(query));
    }

    getRoomMessages(roomId: number, userId = -1) {
        return this.prismaService.$queryRaw(Prisma.sql`
				SELECT messages.id, messages.user_id AS "senderId", messages.message, messages.created_at as "time",
					CASE
						WHEN messages.user_id = ${userId}
							THEN true
						ELSE
							false
					END AS "isMe",
					users.avatar_url
				FROM messages
				INNER JOIN users ON users.id = messages.user_id
				WHERE room_id = ${roomId}
				AND (
					SELECT COUNT(*)
					FROM blacklist
					WHERE blacklist.user_id = ${userId}
					AND blacklist.blocked_user_id = messages.user_id
					) = 0
				ORDER BY id ASC
		`);
    }

    exploreRooms(roomName: string, userId: number) {
        let query = `%${roomName}%`;
        if (query == '') query = '%%';
        return this.prismaService.$queryRaw(Prisma.sql`
					SELECT DISTINCT room.id, room_details.name, room_details.avatar_url, room_type.type,
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

    muteUser(userId: number, roomId: number, muted: boolean) {
        return this.prismaService.$queryRaw(Prisma.sql`
			UPDATE room_user_rel
			SET muted = ${muted}
			WHERE room_id = ${roomId}
			AND user_id = ${userId}
		`);
    }

    banUserFromRoom(userId: number, roomId: number, banned: boolean) {
        return this.prismaService.$queryRaw(Prisma.sql`
			UPDATE room_user_rel
			SET banned = ${banned}
			WHERE room_id = ${roomId}
			AND user_id = ${userId}
		`);
    }

    blockUser(userId: number, blockedUserId: number) {
        return this.prismaService.blacklist.create({
            data: {
                user_id: userId,
                blocked_user_id: blockedUserId,
            },
        });
    }

    unblockUser(userId: number, blockedUserId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
			DELETE FROM blacklist
			WHERE user_id = ${userId}
			AND blocked_user_id = ${blockedUserId}
		`);
    }

    getBlockedUsersByMe(userId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
			SELECT user_id
			FROM blacklist
			WHERE blocked_user_id = ${userId}
		`);
    }

    targetedJoinedRecord(roomId: number, userId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
		SELECT *
		FROM room_user_rel
		WHERE user_id = ${userId}
		AND room_id = ${roomId}
		`);
    }

    async isRoomOwner(roomId: number, userId: number) {
        const room = await this.prismaService.$queryRaw(Prisma.sql`
			SELECT *
			FROM room
			WHERE owner_id = ${userId}
			AND id = ${roomId}
		`);

        if (room[0]) return true;
        return false;
    }

    updateRoomType(roomId: number, roomTypeId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
		UPDATE room
		SET room_type_id = ${roomTypeId}
		WHERE id = ${roomId}
		`);
    }

    async updateRoomRules(roomId: number, rule: string) {
        const getRule = (
            await this.prismaService.$queryRaw(Prisma.sql`
			SELECT *
			FROM room_rules
			WHERE room_id = ${roomId}
		`)
        )[0];
        if (getRule)
            return await this.prismaService.$queryRaw(Prisma.sql`
			UPDATE room_rules
			SET rule = ${rule}
			WHERE room_id = ${roomId}
			`);
        else {
            return this.prismaService.room_rules.create({
                data: {
                    room_id: roomId,
                    rule,
                },
            });
        }
    }

    async getMyRole(userId: number, roomId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
				SELECT
					CASE
						WHEN (
								SELECT COUNT(*)
								FROM room
								WHERE room_user_rel.room_id = room.id
								AND room.owner_id = ${userId}) > 0
							THEN
								'owner'
						ELSE
							room_user_rel.role
					END AS role
				FROM room_user_rel
				WHERE user_id = ${userId}
				AND room_id = ${roomId}
		`);
    }

    kickout(userId: number, roomId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
			DELETE FROM room_user_rel
			WHERE room_id = ${roomId}
			AND user_id = ${userId}
		`);
    }

    getRoomUsersByRole(
        roomId: number,
        actualOwnerId: number,
        role: string,
    ): Promise<room_user_rel[]> {
        return this.prismaService.$queryRaw(Prisma.sql`
			SELECT *
			FROM room_user_rel
			WHERE role LIKE ${role}
			AND room_id = ${roomId}
			AND user_id != ${actualOwnerId}
		`);
    }

    setRoomOwnerShip(roomId: number, newOwnerId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
			UPDATE room
			SET owner_id = ${newOwnerId}
			WHERE id = ${roomId}
		`);
    }

    deleteRoom(roomId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
			DELETE FROM room
			WHERE id = ${roomId}
		`);
    }

    updateRoomInfo(name: string, avatarUrl: string, roomId: number) {
        return this.prismaService.$queryRaw(Prisma.sql`
		UPDATE room_details
		SET name = ${name},
		avatar_url = ${avatarUrl}
		WHERE room_id = ${roomId}
		`);
    }

    updateUserRole(userId: number, roomId: number, role: string) {
        return this.prismaService.$queryRaw(Prisma.sql`
			UPDATE room_user_rel
			SET role = ${role}
			WHERE user_id = ${userId}
			AND room_id = ${roomId}
		`);
    }
}
