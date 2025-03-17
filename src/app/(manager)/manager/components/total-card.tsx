import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClassNameAttribute } from "@/types/className";
import { type ClassValue } from "clsx";
import { LucideIcon, LucideProps } from "lucide-react";
import { JSX } from "react";

interface TotalCardProps {
  icon: LucideIcon;
  // icon: JSX.Element;
  title: string;

  value: string | number | JSX.Element;

  className?: string;

  // classNameIcon?: React.ComponentProps<"div">["className"];
  classNameIcon?: string;
  // classNameIcon?: ClassNameAttribute<SVGElement>;
  subtitle?: string;
}
export const TotalCard = ({
  icon: Icon,
  value,
  title,
  classNameIcon,
  className,
  subtitle,
}: TotalCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>

        <Icon className={cn("h-4 w-4 text-muted-foreground", classNameIcon)} />
      </CardHeader>

      <CardContent className={cn("", className)}>
        <div className="text-2xl font-bold">{value}</div>

        <div className="text-muted-foreground">{subtitle}</div>
      </CardContent>
    </Card>
  );
};
