import { ProfileClientPage } from "@/features/client/profile/profile-client";
import { Suspense } from "react";
import { SidebarContainer } from "../sidebar-container/sidebar-container";

export async function generateMetadata() {
  return {
    title: "Trang cá nhân",
    description:
      "Trang cá nhân và thông tin cá nhân của bạn, cập nhật thông tin cá nhân tại đây.",
  };
}

const ProfilePage = () => {
  return (
    <Suspense>
      {/* <ProfileClientPage /> */}

      <SidebarContainer />
    </Suspense>
  );
};

export default ProfilePage;
