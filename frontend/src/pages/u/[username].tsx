"use client";
import { useEffect, useState } from "react";

import cn from "classnames";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { BiEdit } from "react-icons/bi";
import { FaGlobe, FaTwitter } from "react-icons/fa";

import MainLayout from "@components/layout";
import UserStats from "@components/stats";
import useUser from "@hooks/useUser";
import BaseModal from "@ui/BaseModal";
import Button from "@ui/Button";
import { IconButton } from "@ui/Button";
import { ExternalLink } from "@ui/Links";
import { APP_NAME } from "@utils/constants";
import { removeUser } from "@utils/local-storage";
import { useAuthContext } from "context/auth.context";
import { useUIContext } from "context/ui.context";
import { IUser, SetStateFunc } from "global/types";

const LastGames = dynamic(() => import("@components/stats/History"), {
  ssr: false,
});
// import LastGames from "@components/stats/History";

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
      className="group flex h-8 cursor-pointer items-center overflow-hidden"
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
    <div className="flex h-full items-start justify-between p-5 sm:px-6">
      <header className="flex flex-col ">
        {fullName && (
          <p className="text-2xl font-bold text-gray-900">{fullName}</p>
        )}
        <p className="text-sm font-normal text-gray-400">@{username}</p>
        <p className="text-base">{bio}</p>
      </header>
      {/* Socials */}
      <article className="hidden sm:flex">
        <ul className="flex flex-col items-start gap-y-4 px-4">
          {links?.twitter && (
            <SocialLink
              href={`https://twitter.com/${links.twitter}`}
              title={`@${links.twitter}`}
              icon={
                <FaTwitter className="mr-3 h-6 w-6 text-blue-500 group-hover:text-blue-400" />
              }
            />
          )}
          {links?.intra && (
            <SocialLink
              href={`https://intra.42.fr/users/${links.intra}`}
              title={`@${links.intra}`}
              icon={
                <FaGlobe className="mr-3 h-6 w-6 text-gray-700 group-hover:text-gray-500" />
              }
            />
          )}
        </ul>
      </article>
    </div>
  );
};

const UserNotFoundHeader = ({ username }: { username: string }) => (
  <section className="h-full w-full rounded-b-xl bg-white py-2 shadow-md">
    <div className="flex items-start justify-between px-10 pb-8 pt-14 sm:py-10">
      <p className="text-lg font-semibold text-gray-800">@{username}</p>
    </div>
    <div className="flex flex-col items-center justify-center pb-16">
      <p className="text-center text-4xl font-bold text-gray-900 sm:text-2xl md:text-3xl lg:text-4xl">
        This account {"doesn't"} exist
      </p>
      <p className="text-base font-normal text-gray-600">
        Try searching for another.
      </p>
    </div>
  </section>
);

const UserLoadingHeader = () => (
  <section className="h-full w-full rounded-b-xl bg-white py-2 shadow-md">
    <div className="flex items-start justify-between px-10 pb-8 pt-14 sm:py-10">
      <p className="text-lg font-semibold text-gray-800">
        <span className="animate-pulse">Loading...</span>
      </p>
    </div>
    <div className="flex flex-col items-center justify-center pb-16">
      <p className="text-center text-4xl font-bold text-gray-900">
        <span className="animate-pulse">Loading...</span>
      </p>
    </div>
  </section>
);

const UserInfoHeader = ({
  user,
  username, // this is the username in the url. used to show a 404 components if the user doesn't exist
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
}) => {
  const { setIsSettingsOpen } = useUIContext();
  return (
    <div className="flex w-full flex-col gap-y-2 ">
      <div className="flex w-full justify-between gap-x-2 shadow-lg">
        {/* Cover and profile picture */}
        <div className="w-full">
          <figure className="relative h-[280px] w-full">
            {user ? (
              !user.cover_url ? (
                <div className="h-full w-full rounded-t-xl bg-gray-300 " />
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
              <div className="h-full w-full rounded-t-xl bg-gray-300 " />
            )}
            <figure
              className="absolute -bottom-14 left-8 h-[160px] w-[160px] rounded-full ring-4 ring-white sm:-bottom-8 sm:left-10"
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
                  className="cursor-pointer rounded-full object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-full bg-gray-200 " />
              )}
            </figure>
          </figure>
          <section className="h-[220px]">
            {user ? (
              <div className="h-full w-full rounded-b-xl bg-white py-2 shadow-md">
                {/* Action buttons */}
                <div className="flex h-12 w-full justify-end">
                  <div className="flex w-1/2 justify-end px-6 py-1 ">
                    {isMyProfile ? (
                      <IconButton
                        icon={<BiEdit className="h-6 w-6" />}
                        onClick={() => {
                          setIsSettingsOpen(true);
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
                  fullName={`${user?.first_name} ${user?.last_name}`}
                  username={user?.username as string}
                  bio={user?.bio}
                  links={{
                    twitter: user?.twitterUsername!,
                    intra: user?.intraUsername,
                  }}
                />
              </div>
            ) : !isLoading ? (
              <UserNotFoundHeader username={username} />
            ) : (
              <UserLoadingHeader />
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

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
      title={username ? username + " | " + APP_NAME : APP_NAME}
      backgroundColor="bg-gray-100"
    >
      <div className="flex w-full max-w-7xl flex-col gap-3 px-2 xl:px-0">
        <div className="flex flex-col gap-3 sm:flex-row">
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
      </div>

      {/* Modals */}
      {isAvatarModalOpen && user && (
        <BaseModal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
        >
          <div className="flex h-[600px] w-[600px] flex-col items-center justify-center ">
            <Image
              src={user.data?.avatar_url || "/images/default-avatar.jpg"}
              alt={`avatar for ${username}`}
              fill
              className="rounded-full object-cover"
            />
          </div>
        </BaseModal>
      )}
      {setIsCoverModalOpen && (
        <BaseModal
          isOpen={isCoverModalOpen}
          onClose={() => setIsCoverModalOpen(false)}
        >
          <div className="flex h-[220px] w-[900px] flex-col items-center justify-center">
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
