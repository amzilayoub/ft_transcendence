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
  fullName: string;
  // firstName: string;
  // middleName: string;
  // lastName: string;
  intraUsername: string;
  email: string;
  bio: string;
  avatarUrl: string;
  coverUrl: string;
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
export interface IConversation {
  id: string;
  name: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadMessagesCount: number;
}
