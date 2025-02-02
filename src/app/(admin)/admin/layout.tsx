interface AdminRouteLayoutProps {
  children: React.ReactNode;
  auth: React.ReactNode;
  test: React.ReactNode;
}

const AdminRouteLayout = ({ children, auth, test }: AdminRouteLayoutProps) => {
  return (
    <>
      {/* {children} */}
      {auth}
      {/* {test} */}
    </>
  );
};

export default AdminRouteLayout;
