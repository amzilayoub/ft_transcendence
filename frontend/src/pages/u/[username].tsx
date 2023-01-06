import { ReactElement, useEffect, useState } from "react";

import cn from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { BiEdit } from "react-icons/bi";
import { FaGlobe, FaTwitter } from "react-icons/fa";
import { IconType } from "react-icons/lib";

import BaseModal from "@components/common/BaseModal";
import { ExternalLink } from "@components/common/Links";
import MainLayout from "@components/layout";
import * as api from "@lib/api";
import Button from "@ui/Button";
import { useAuthContext } from "context/auth.context";
import { IUser, SetStateFunc } from "global/types";

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
    twitter: string;
    intra: string;
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
          <SocialLink
            href={`https://intra.42.fr/users/${links.intra}`}
            title={`@${links.intra}`}
            icon={
              <FaGlobe className="mr-3 h-6 w-6 text-gray-700 group-hover:text-gray-500" />
            }
          />
        </ul>
      </article>
    </div>
  );
};
const UserNotFoundHeader = ({ username }: { username: string }) => (
  <section className="w-full rounded-b-xl bg-white py-2 shadow-md">
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

const UserInfoHeader = ({
  user,
  username, // this is the username in the url. used to show a 404 page if the user doesn't exist
  isMyProfile,
  setIsCoverModalOpen,
  setIsAvatarModalOpen,
}: {
  user: IUser | null;
  username: string;
  isMyProfile: boolean;
  setIsCoverModalOpen: SetStateFunc<boolean>;
  setIsAvatarModalOpen: SetStateFunc<boolean>;
}) => (
  <div className="flex w-full flex-col gap-y-2 px-2">
    <div className="flex w-full justify-between gap-x-2">
      {/* Cover and profile picture */}
      <div className="w-full">
        <figure className="relative w-full h-[220px]">
          {user ? (
            <Image
              src={user?.coverUrl || "/images/cover-placeholder.png"}
              alt={
                user?.coverUrl
                  ? `cover for ${user?.username}`
                  : "cover placeholder"
              }
              onClick={() => setIsCoverModalOpen(true)}
              fill
              className="rounded-t-xl object-fill cursor-pointer"
            />
          ) : (
            <div className="w-full h-full rounded-t-xl bg-gray-300 " />
          )}
          <figure
            className="w-[160px] h-[160px] absolute -bottom-14 left-8 rounded-full sm:-bottom-8 sm:left-10 ring-4 ring-white"
            onClick={() => setIsAvatarModalOpen(true)}
          >
            {user ? (
              <Image
                src={user?.avatarUrl || "/images/avatar-placeholder.png"}
                alt={
                  user?.avatarUrl
                    ? `avatar for ${user?.username}`
                    : "avatar placeholder"
                }
                fill
                className="rounded-full object-cover cursor-pointer"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 " />
            )}
          </figure>
        </figure>
        {user ? (
          <section className="w-full rounded-b-xl bg-white py-2 shadow-md">
            {/* Action buttons */}
            <div className="flex h-12 w-full justify-end ">
              <div className="flex w-1/2 justify-end px-6 py-1 ">
                {isMyProfile ? (
                  <UtilityButton
                    icon={<BiEdit className="h-6 w-6" />}
                    onClick={() => {
                      setIsAvatarModalOpen(true);
                    }}
                  />
                ) : (
                  <Button
                    onClick={() => {}}
                    className={cn({
                      "bg-opacity-70": user?.isFollowing,
                    })}
                  >
                    <p>{user?.isFollowing ? "Following" : "Follow"}</p>
                  </Button>
                )}
              </div>
            </div>

            {/* User info */}
            <UserInfo
              fullName={user?.fullName}
              username={user?.username as string}
              bio={user?.bio}
              links={{
                twitter: user?.twitterUsername,
                intra: user?.intraUsername,
              }}
            />
          </section>
        ) : (
          <UserNotFoundHeader username={username} />
        )}
      </div>
    </div>
  </div>
);

const ProfilePage = () => {
  const router = useRouter();

  const ctx = useAuthContext();
  const username = Array.isArray(router.query)
    ? router.query[0]
    : router.query.username;
  const isMyProfile = router.isReady && username === ctx?.user?.username;

  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

  // console.log('C', ctx)
  useEffect(() => {
    if (router.isReady && ctx.isAuthenticated === false) {
      router.replace("/");
    }
  }, [router, ctx.isAuthenticated]);

  useEffect(() => {
    if (!router.isReady) return;
    if (isMyProfile) {
      setUser(ctx.user);
    } else {
      api.getUserByUsername(username).then((user) => {
        setUser(user);
      });
    }
  }, [username, isMyProfile, ctx.user, router.isReady]);

  return (
    <MainLayout title={username as string} backgroundColor="bg-gray-100">
      <div className="w-full max-w-7xl">
        <UserInfoHeader
          user={user}
          username={username}
          isMyProfile={isMyProfile}
          setIsAvatarModalOpen={setIsAvatarModalOpen}
          setIsCoverModalOpen={setIsCoverModalOpen}
        />
      </div>
      {/* Modals */}
      {isAvatarModalOpen && user && (
        <BaseModal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
        >
          <div className="w-[600px] h-[600px] flex flex-col items-center justify-center ">
            <Image
              src={user?.avatarUrl || "/images/avatar-placeholder.png"}
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
          <div className="w-[900px] h-[220px] flex flex-col items-center justify-center">
            <Image
              src={user?.coverUrl || "/images/cover-placeholder.png"}
              alt={`cover for ${username}`}
              fill
              className="object-cover"
            />
          </div>
        </BaseModal>
      )}
    </MainLayout>
  );
};

export default ProfilePage;
