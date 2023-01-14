"use client";
import { ReactElement, useEffect, useState } from "react";

import cn from "classnames";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { BiEdit } from "react-icons/bi";
import { FaGlobe, FaTwitter } from "react-icons/fa";
import { IconType } from "react-icons/lib";

import BaseModal from "@components/common/BaseModal";
import { ExternalLink } from "@components/common/Links";
import MainLayout from "@components/layout";
import UserStats from "@components/stats";
import useUser from "@hooks/useUser";
import Button from "@ui/Button";
import { APP_NAME } from "@utils/constants";
import { removeUser } from "@utils/local-storage";
import { useAuthContext } from "context/auth.context";
import { IUser, SetStateFunc } from "global/types";

const LastGames = dynamic(() => import("@components/stats/History"), {
  ssr: false,
});

const UtilityButton = ({
  icon,
  title,
  onClick,
  className,
}: {
  icon: ReactElement<IconType>;
  title?: string;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <button
      className={cn(
        "flex items-center justify-center p-2 rounded-full",
        className
      )}
      onClick={onClick}
    >
      {icon}
      {title && <span className="ml-2">{title}</span>}
    </button>
  );
};

const SocialLink = ({
  href,
  icon,
  title,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
}) => {
  return (
    <ExternalLink
      href={href}
      className="group flex items-center h-8 overflow-hidden cursor-pointer"
    >
      {icon}
      <p className="w-56">
        <span className="text-sm font-normal text-gray-600 ">{title}</span>
      </p>
    </ExternalLink>
  );
};

const UserInfo = ({
  fullName,
  username,
  bio,
  links,
}: {
  fullName: string;
  username: string;
  bio: string;
  links: {
    twitter: string | null;
    intra: string | null;
  };
}) => {
  return (
    <div className="flex items-start justify-between p-5 sm:px-6">
      <header className="flex flex-col ">
        {fullName && (
          <p className="text-2xl font-bold text-gray-900">{fullName}</p>
        )}
        <p className="text-sm font-normal text-gray-400">@{username}</p>
        <p className="text-base">{bio}</p>
      </header>
      {/* Socials */}
      <article className="hidden sm:flex">
        <ul className="flex flex-col items-start px-4 gap-y-4">
          {links?.twitter && (
            <SocialLink
              href={`https://twitter.com/${links.twitter}`}
              title={`@${links.twitter}`}
              icon={
                <FaTwitter className="w-6 h-6 mr-3 text-blue-500 group-hover:text-blue-400" />
              }
            />
          )}
          {links?.intra && (
            <SocialLink
              href={`https://intra.42.fr/users/${links.intra}`}
              title={`@${links.intra}`}
              icon={
                <FaGlobe className="w-6 h-6 mr-3 text-gray-700 group-hover:text-gray-500" />
              }
            />
          )}
        </ul>
      </article>
    </div>
  );
};
const UserNotFoundHeader = ({ username }: { username: string }) => (
  <section className="w-full py-2 bg-white shadow-md rounded-b-xl">
    <div className="flex items-start justify-between p-10">
      <p className="text-lg font-semibold text-gray-800">@{username}</p>
    </div>
    <div className="flex flex-col items-center justify-center pb-16">
      <p className="text-4xl font-bold text-gray-900">
        This account {"doesn't"} exist
      </p>
      <p className="text-base font-normal text-gray-600">
        Try searching for another.
      </p>
    </div>
  </section>
);

const UserLoadingHeader = () => (
  <section className="w-full py-2 bg-white shadow-md rounded-b-xl">
    <div className="flex items-start justify-between p-10">
      <p className="text-lg font-semibold text-gray-800">
        <span className="animate-pulse">Loading...</span>
      </p>
    </div>
  </section>
);

const UserInfoHeader = ({
  user,
  username, // this is the username in the url. used to show a 404 page if the user doesn't exist
  isMyProfile,
  isLoading,
  setIsCoverModalOpen,
  setIsAvatarModalOpen,
}: {
  user: IUser | null;
  username: string;
  isMyProfile: boolean;
  isLoading: boolean;
  setIsCoverModalOpen: SetStateFunc<boolean>;
  setIsAvatarModalOpen: SetStateFunc<boolean>;
}) => (
  <div className="flex flex-col w-full px-2 gap-y-2">
    <div className="flex justify-between w-full gap-x-2">
      {/* Cover and profile picture */}
      <div className="w-full">
        <figure className="relative w-full h-[220px]">
          {user ? (
            !user.cover_url ? (
              <div className="w-full h-full bg-gray-300 rounded-t-xl " />
            ) : (
              <Image
                src={user?.cover_url || "/images/cover-placeholder.png"}
                alt={
                  user?.cover_url
                    ? `cover for ${user?.username}`
                    : "cover placeholder"
                }
                onClick={() => user?.cover_url && setIsCoverModalOpen(true)}
                fill
                className={cn("object-cover rounded-t-xl", {
                  "cursor-pointer": user?.cover_url,
                })}
              />
            )
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-t-xl " />
          )}
          <figure
            className="w-[160px] h-[160px] absolute -bottom-14 left-8 rounded-full sm:-bottom-8 sm:left-10 ring-4 ring-white"
            onClick={() => setIsAvatarModalOpen(true)}
          >
            {user ? (
              <Image
                src={user?.avatar_url || "/images/default-avatar.jpg"}
                alt={
                  user?.avatar_url
                    ? `avatar for ${user?.username}`
                    : "avatar placeholder"
                }
                fill
                className="object-cover rounded-full cursor-pointer"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full " />
            )}
          </figure>
        </figure>
        {user ? (
          <section className="w-full py-2 bg-white shadow-md rounded-b-xl">
            {/* Action buttons */}
            <div className="flex justify-end w-full h-12 ">
              <div className="flex justify-end w-1/2 px-6 py-1 ">
                {isMyProfile ? (
                  <UtilityButton
                    icon={<BiEdit className="w-6 h-6" />}
                    onClick={() => {
                      setIsAvatarModalOpen(true);
                    }}
                  />
                ) : (
                  <Button
                    onClick={() => {}}
                    className={cn({
                      "bg-opacity-70": user?.is_following,
                    })}
                  >
                    <p>{user?.is_following ? "Following" : "Follow"}</p>
                  </Button>
                )}
              </div>
            </div>

            {/* User info */}
            <UserInfo
              fullName={user?.first_name}
              username={user?.username as string}
              bio={user?.bio}
              links={{
                twitter: user?.twitterUsername!,
                intra: user?.intraUsername,
              }}
            />
          </section>
        ) : !isLoading ? (
          <UserNotFoundHeader username={username} />
        ) : (
          <UserLoadingHeader />
        )}
      </div>
    </div>
  </div>
);

export default function ProfilePage() {
  const router = useRouter();

  const ctx = useAuthContext();
  const username = Array.isArray(router.query)
    ? router.query[0]
    : router.query.username;
  const isMyProfile = router.isReady && username === ctx?.user?.username;

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const user = useUser(username, router.isReady);

  useEffect(() => {
    if (
      router.isReady &&
      ctx.loadingUser === false &&
      ctx.isAuthenticated === false
    ) {
      removeUser();
      router.push("/");
    }
  }, [router, ctx.isAuthenticated, ctx.loadingUser]);

  return (
    <MainLayout
      title={user ? (username as string) + " | " + APP_NAME : APP_NAME}
      backgroundColor="bg-gray-100"
    >
      <div className="w-full max-w-7xl flex">
        <UserInfoHeader
          isLoading={ctx.loadingUser || user.isLoading}
          user={user.data}
          username={username}
          isMyProfile={isMyProfile}
          setIsAvatarModalOpen={setIsAvatarModalOpen}
          setIsCoverModalOpen={setIsCoverModalOpen}
        />
        <UserStats username={username} />
      </div>
      <LastGames username={username} />

      {/* Modals */}
      {isAvatarModalOpen && user && (
        <BaseModal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
        >
          <div className="w-[600px] h-[600px] flex flex-col items-center justify-center ">
            <Image
              src={user.data?.avatar_url || "/images/default-avatar.jpg"}
              alt={`avatar for ${username}`}
              fill
              className="object-cover rounded-full"
            />
          </div>
        </BaseModal>
      )}
      {setIsCoverModalOpen && (
        <BaseModal
          isOpen={isCoverModalOpen}
          onClose={() => setIsCoverModalOpen(false)}
        >
          <div className="w-[900px] h-[220px] flex flex-col items-center justify-center">
            <Image
              src={user.data?.cover_url || "/images/cover-placeholder.png"}
              alt={`cover for ${username}`}
              fill
              className="object-cover"
            />
          </div>
        </BaseModal>
      )}
    </MainLayout>
  );
}
