interface LayoutFilterProps {
  children: React.ReactNode;
}

const LayoutFilter = ({ children }: LayoutFilterProps) => {
  return <div className="p-10">{children}</div>;
};

export default LayoutFilter;
