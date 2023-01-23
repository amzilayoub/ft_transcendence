import { Dispatch } from "react";

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export type PartialWithRequired<T, K extends keyof T> = Partial<T> & Pick<T, K>;

type SetStateAction<S> = S | ((prevState: S) => S);
export type SetStateFunc<S> = Dispatch<SetStateAction<S>>; // y not?

export type PromiseFunc<T> = (...args: any[]) => Promise<T>;

export interface IFetchError {
  status: number;
  statusText: string;
  message: string;
}

////////////////////////

export enum RoomType {
  PUBLIC = "public",
  PRIVATE = "private",
  PROTECTED = "protected",
  DIRECT = "direct",
}

export enum MembershipStatus {
  OWNER = "owner",
  MEMBER = "member",
  MODERATOR = "moderator",
}

export enum MemberGameStatus {
  PLAYING = "playing",
  IDLE = "idle",
  WAITING = "waiting", // queued
  WATCHING = "watching",
}

export interface IUser {
  username: string;
  first_name: string;
  last_name: string;
  // first_name: string;
  // middleName: string;
  twitterUsername?: string;
  intraUsername: string;
  email: string;
  bio: string;
  avatar_url: string;
  cover_url: string;
  is_following: boolean;
  is_follower: boolean;
  followers_count: number;
  following_count: number;
}

export interface IUserAnalytics {
  gamesCount: number;
  drawsCount: number;
  winsCount: number;
  losesCount: number; // or: gamesCount - (drawsCount + winsCount)
  rating: number;
  rannk: number;
}

export interface ICurrentUser extends IUser {}

// this holds only the data that is needed to display a conversation
export interface IConversationMetaData {
  id: string;
  name: string;
  avatar_url: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadMessagesCount: number;
  created_at: Date;
  room_id: number;
  type: string;
  user_id: number;
  isActiveBox?: boolean;
}

export interface IMessageSender {
  id: string;
  avatar_url: string;
  username: string;
}

export interface IMessage {
  id: number;
  is_read: boolean;
  message: string;
  room_id: number;
  updated_at: Date;
  userLink: { id: number; username: string; avatar_url: string };
  user_id: number; // duplicate of userLink.id
  created_at: Date;
}

export interface IConversation {
  id: string;
  members: string[]; // ids of the members. Current user is always first.
  messages: IMessage[];
}

// this holds only the data that is needed to display a friend in the friends list, chat list, etc.
export interface IFriendMetaData extends IConversationMetaData {
  isOnline: boolean;
}

export interface IRoom {
  id: number;
  name: string;
  description: string;
  avatar_url: string;
  type: RoomType;
  created_at: Date;
  // updated_at: Date;
  members: IRoomMember[];
}

export interface IRoomMember {
  id: number;
  username: string;
  avatar_url: string;
  isOnline: boolean;
  gameStatus: MemberGameStatus;
  membershipStatus: MembershipStatus;
  isBanned: boolean;
  isMuted: boolean;
  mutedUntil: Date;
}
