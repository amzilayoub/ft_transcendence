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
import Button from "@ui/Button";

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

const ProfilePage = () => {
  const router = useRouter();
  const { username } = router.query;
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const coverUrl =
    "https://images.unsplash.com/photo-1614850715649-1d0106293bd1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80";

  const avatarUrl =
    "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8";

  const fullName = "John Doe";
  const bio = "I am a John Doe, I do things";

  useEffect(() => {
    /* this will be changed based on the logged in user
     ** e.g.
     ** const userCtx = useContext(UserContext);
     ** setIsMyProfile(userCtx.username === username);
     */
    setIsMyProfile(username === "me");
  }, [username]);

  return (
    <MainLayout title={username as string} backgroundColor="bg-gray-100">
      <div className="w-full max-w-7xl">
        <div className="flex w-full flex-col gap-y-2 px-2">
          <div className="flex w-full justify-between gap-x-2">
            {/* Cover and profile picture */}
            <div className="w-full">
              <figure className="relative w-full cursor-pointer h-[220px]">
                <Image
                  src={coverUrl}
                  alt={`cover for ${username}`}
                  onClick={() => setIsCoverModalOpen(true)}
                  fill
                  className="rounded-t-xl object-fill"
                />
                <figure
                  className="w-[160px] h-[160px] absolute -bottom-14 left-8 rounded-full sm:-bottom-8 sm:left-10"
                  onClick={() => setIsAvatarModalOpen(true)}
                >
                  <Image
                    src={avatarUrl}
                    alt={`avatar for ${username}`}
                    fill
                    className="rounded-full object-cover"
                  />
                </figure>
              </figure>

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
                        onClick={() => setIsFollowing(!isFollowing)}
                        className={cn({
                          "bg-opacity-70": isFollowing,
                        })}
                      >
                        <p>{isFollowing ? "Following" : "Follow"}</p>
                      </Button>
                    )}
                  </div>
                </div>

                {/* User info */}
                <UserInfo
                  fullName={fullName}
                  username={username as string}
                  bio={bio}
                  links={{
                    twitter: "john_doe",
                    intra: "jdoe",
                  }}
                />
              </section>
            </div>
            {/* <div className="hidden w-72 lg:block">
            </div> */}
          </div>
        </div>
      </div>
      {/* Modals */}
      {isAvatarModalOpen && (
        <BaseModal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
        >
          <div className="w-[600px] h-[600px] flex flex-col items-center justify-center ">
            <Image
              src={avatarUrl}
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
              src={coverUrl}
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
