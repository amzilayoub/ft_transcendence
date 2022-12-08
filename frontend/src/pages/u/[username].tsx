import { useRouter } from "next/router";

import MainLayout from "@components/layout";

export default function ProfilePage() {
  const router = useRouter();
  const { username } = router.query;
  return (
    <MainLayout title={`@${username}`}>
      <h1 className="text-3xl font-semibold text-center py-10">
        User: {username}
      </h1>
    </MainLayout>
  );
}
