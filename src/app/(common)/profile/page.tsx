import { ProfileClientPage } from "@/features/client/profile/profile-client";

export async function generateMetadata() {
  return {
    title: "Trang cá nhân",
    description:
      "Trang cá nhân và thông tin cá nhân của bạn, cập nhật thông tin cá nhân tại đây.",
  };
}

const ProfilePage = () => {
  return <ProfileClientPage />;
};

export default ProfilePage;
