interface ClientLayoutProps {
  children: React.ReactNode;
  test1: React.ReactNode;
  test2: React.ReactNode;
}

const ClientLayout = ({ children, test1, test2 }: ClientLayoutProps) => {
  return (
    <div className="flex flex-col">
      {children}
      <div>{test1}</div>
      <div>{test2}</div>
    </div>
  );
};

export default ClientLayout;
