import { Dispatch } from "react";

type SetStateAction<S> = S | ((prevState: S) => S);
export type SetStateFunc<S> = Dispatch<SetStateAction<S>>; // y not?

export type PromiseFunc<T> = (...args: any[]) => Promise<T>;

export interface IFetchError {
  status: number;
  statusText: string;
  message: string;
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
  isFollowing: boolean;
  isFollower: boolean;
  followersCount: number;
  followingCount: number;
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
