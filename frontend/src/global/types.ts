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

export interface IMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
}

export interface IConversation {
  members: string[]; // ids of the members. Current user is always first.
  messages: IMessage[];
}

// this holds only the data that is needed to display a friend in the friends list, chat list, etc.
export interface IFriendMetaData extends IConversationMetaData {
  isOnline: boolean;
}
