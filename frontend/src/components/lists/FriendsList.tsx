import React from "react";

import cn from "classnames";
import Image from "next/image";
import Link from "next/link";

import { fetcher } from "@utils/swr.fetcher";
import useSWR from "swr/immutable";

const Friend = (props: {
	  username: string;
	  avatar_url: string;
	  nickname: string;
	  userStatus: string;
  }) => (
	<div className="flex gap-x-4 border-black p-2 w-full h-full items-center" >
	  <Link href={`/u/${props.username}`} className="flex items-center w-full gap-x-2 relative">
			<Image
			  src={props.avatar_url}
			  alt={props.username + " avatar"}
			  width={100}
			  height={100}
			  className="h-12 w-12 rounded-full object-cover"
			/>
		<div className="flex flex-col justify-start w-full">
		<p className="text-lg font-semibold">{props.username}</p>
		<p className="text-sm text-gray-500">({props.nickname})</p>
		</div>
		<svg
                  id="status-circle"
                  width="13"
                  height="13"
                  className={cn("absolute top-1 right-1 ", {
                    "text-green-500": props.userStatus === "online",
                    "text-gray-500": props.userStatus === "offline",
                    "text-yellow-500": props.userStatus === "playing",
                  })}
                >
                  <circle cx="6" cy="6" r="6" fill="currentColor" />
                </svg>

	  </Link>
	</div>
  );

const FriendsList = ({ username } : { username: string }) => {
	const { data, isLoading } = useSWR(
		username !== undefined ? `/users/${username}/friends` : null,
		fetcher, 
	  { 
		refreshInterval: 2000,
		
	   },
	);
	
	return (
	  <>
		<nav className="flex min-h-[400px] flex-col gap-y-4 rounded-xl border bg-white px-4 py-5 shadow-lg #max-w-lg min-w-[300px]">
		  <div className="flex items-center justify-between">
			<p className="text-xl font-bold text-gray-900">Friends</p>
		  </div>
		  <div className="h-px bg-gray-200 " />
		  {0 ? (
			<p>Loading...</p>
		  ) : (
			<ul className="flex flex-col gap-y-2 ">
			  {data?.slice(0, 10).map((friend: any) => (
				<li
				  key={friend.id}
				  className="rounded-md border border-gray-100"
				>
					<Friend {...friend} userStatus={friend.status} />
				</li>
			  ))}
			</ul>
		  )}
		</nav>
	  </>
	);
  };
  
  export default FriendsList;
  