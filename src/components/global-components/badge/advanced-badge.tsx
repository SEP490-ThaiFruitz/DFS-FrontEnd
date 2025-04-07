import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { CheckIcon } from "lucide-react";
import type { ReactNode } from "react";

export default function AdvancedBadgesVariant1() {
  const colors = Object.keys(badgeColorVariants) as ColorType[];
  return (
    <div className="h-full w-full space-y-4">
      <p className="text-neutral-400">With icon & without border</p>
      <div className="flex flex-wrap gap-4">
        {colors.map((color) => (
          <AdvancedColorfulBadges color={color} key={color} rounded="lg">
            <CheckIcon className="size-4" />
            {color}
          </AdvancedColorfulBadges>
        ))}
      </div>
      <p className="text-neutral-400">With border & rounded full</p>
      <div className="flex flex-wrap gap-4">
        {colors.map((color) => (
          <AdvancedColorfulBadges
            border={true}
            color={color}
            key={color}
            rounded="full"
          >
            {color}
          </AdvancedColorfulBadges>
        ))}
      </div>
    </div>
  );
}

type ColorType = keyof typeof badgeColorVariants;
const badgeColorVariants = {
  neutral:
    "text-neutral-600 bg-neutral-400/10 dark:text-neutral-200 border-neutral-500/20",
  green:
    "text-green-600 bg-green-400/10 dark:text-green-400 border-green-200/80",
  blue: "text-blue-600 bg-blue-400/10 dark:text-blue-400 border-blue-200/80",
  red: "text-red-600 bg-red-400/10 dark:text-red-400 border-red-200/80",
  orange:
    "text-orange-600  bg-orange-400/10 dark:text-orange-400 border-orange-200/80",
  yellow:
    "text-yellow-600 bg-yellow-400/10 dark:text-yellow-400 border-yellow-400/60",
  violet:
    "text-violet-600 bg-violet-400/10 dark:text-violet-400 border-violet-200/80",
  // Add other colors here

  // plentiful colors

  // pink: "text-pink-600 bg-pink-400/10 dark:text-pink-400 border-pink-200/80",
  // indigo:
  //   "text-indigo-600 bg-indigo-400/10 dark:text-indigo-400 border-indigo-200/80",
  // teal: "text-teal-600 bg-teal-400/10 dark:text-teal-400 border-teal-200/80",
  // amber:
  //   "text-amber-600 bg-amber-400/10 dark:text-amber-400 border-amber-200/80",
  // lime: "text-lime-600 bg-lime-400/10 dark:text-lime-400 border-lime-200/80",
  // cyan: "text-cyan-600 bg-cyan-400/10 dark:text-cyan-400 border-cyan-200/80",
  // fuchsia:
  //   "text-fuchsia-600 bg-fuchsia-400/10 dark:text-fuchsia-400 border-fuchsia-200/80",
  // rose: "text-rose-600 bg-rose-400/10 dark:text-rose-400 border-rose-200/80",
  pink: "text-[#db2777] bg-[#fbcfe81a] dark:text-[#f472b6] border-[#fbcfe8cc]",
  indigo:
    "text-[#4f46e5] bg-[#a5b4fc1a] dark:text-[#818cf8] border-[#e0e7ffcc]",
  teal: "text-[#0d9488] bg-[#5eead41a] dark:text-[#2dd4bf] border-[#ccfbf1cc]",
  amber: "text-[#d97706] bg-[#fcd34d1a] dark:text-[#fbbf24] border-[#fef3c7cc]",
  lime: "text-[#65a30d] bg-[#a3e6351a] dark:text-[#84cc16] border-[#ecfccbcc]",
  cyan: "text-[#0891b2] bg-[#67e8f91a] dark:text-[#22d3ee] border-[#cffafecc]",
  fuchsia:
    "text-[#c026d3] bg-[#e879f91a] dark:text-[#d946ef] border-[#fae8ffcc]",
  rose: "text-[#e11d48] bg-[#fda4af1a] dark:text-[#fb7185] border-[#ffe4e6cc]",

  // plentiful colors
  brown: "text-[#854d0e] bg-[#fef9c3] dark:text-[#fde047] border-[#fde047cc]",
  slate: "text-[#334155] bg-[#e2e8f0] dark:text-[#94a3b8] border-[#94a3b8cc]",
  limeGreen:
    "text-[#3f6212] bg-[#d9f99d] dark:text-[#bef264] border-[#bef264cc]",
  mint: "text-[#047857] bg-[#d1fae5] dark:text-[#6ee7b7] border-[#6ee7b7cc]",
  chartreuse:
    "text-[#4d7c0f] bg-[#d9f99d] dark:text-[#bef264] border-[#bef264cc]",
  lavender:
    "text-[#7e22ce] bg-[#f3e8ff] dark:text-[#d8b4fe] border-[#d8b4fecc]",
  coral: "text-[#dc2626] bg-[#fee2e2] dark:text-[#fca5a5] border-[#fca5a5cc]",
  periwinkle:
    "text-[#2563eb] bg-[#dbeafe] dark:text-[#93c5fd] border-[#93c5fdcc]",
  maroon: "text-[#991b1b] bg-[#fee2e2] dark:text-[#fca5a5] border-[#fca5a5cc]",
  gold: "text-[#b45309] bg-[#fef3c7] dark:text-[#fcd34d] border-[#fcd34dcc]",
  silver: "text-[#4b5563] bg-[#f3f4f6] dark:text-[#d1d5db] border-[#d1d5dbcc]",
  bronze: "text-[#c2410c] bg-[#ffedd5] dark:text-[#fdba74] border-[#fdba74cc]",
  olive: "text-[#3f6212] bg-[#ecfccb] dark:text-[#a3e635] border-[#a3e635cc]",
  peach: "text-[#ea580c] bg-[#ffedd5] dark:text-[#fdba74] border-[#fdba74cc]",
  blush: "text-[#db2777] bg-[#fce7f3] dark:text-[#f9a8d4] border-[#f9a8d4cc]",
  mustard: "text-[#a16207] bg-[#fef3c7] dark:text-[#fcd34d] border-[#fcd34dcc]",
  raspberry:
    "text-[#be185d] bg-[#fce7f3] dark:text-[#f9a8d4] border-[#f9a8d4cc]",
  electricBlue:
    "text-[#2563eb] bg-[#dbeafe] dark:text-[#93c5fd] border-[#93c5fdcc]",
  seafoam: "text-[#059669] bg-[#d1fae5] dark:text-[#6ee7b7] border-[#6ee7b7cc]",
  mintGreen:
    "text-[#059669] bg-[#d1fae5] dark:text-[#6ee7b7] border-[#6ee7b7cc]",
  ultramarine:
    "text-[#1e40af] bg-[#dbeafe] dark:text-[#93c5fd] border-[#93c5fdcc]",

  // Additional vibrant colors
  neonPink:
    "text-[#db2777] bg-[#fce7f3] dark:text-[#f9a8d4] border-[#f9a8d4cc]",
  turquoise:
    "text-[#0d9488] bg-[#ccfbf1] dark:text-[#5eead4] border-[#5eead4cc]",
  magenta: "text-[#c026d3] bg-[#fae8ff] dark:text-[#e879f9] border-[#e879f9cc]",
  sunflower:
    "text-[#d97706] bg-[#fef3c7] dark:text-[#fcd34d] border-[#fcd34dcc]",
  sapphire:
    "text-[#1d4ed8] bg-[#dbeafe] dark:text-[#93c5fd] border-[#93c5fdcc]",
  emerald: "text-[#059669] bg-[#d1fae5] dark:text-[#6ee7b7] border-[#6ee7b7cc]",
  ruby: "text-[#dc2626] bg-[#fee2e2] dark:text-[#fca5a5] border-[#fca5a5cc]",
  amethyst:
    "text-[#7e22ce] bg-[#f3e8ff] dark:text-[#d8b4fe] border-[#d8b4fecc]",
  tangerine:
    "text-[#ea580c] bg-[#ffedd5] dark:text-[#fdba74] border-[#fdba74cc]",
  aquamarine:
    "text-[#0891b2] bg-[#cffafe] dark:text-[#67e8f9] border-[#67e8f9cc]",
};

const badgeSizeVariants = {
  sm: "h-6 px-2",
  md: "h-7 px-3",
  lg: "h-8 px-4",
  icon: "size-10",
};

const badgeRoundedVariants = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

const badgesVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md transition-colors dark:bg-neutral-800 dark:border-neutral-700 gap-1",
  {
    variants: {
      color: badgeColorVariants,
      size: badgeSizeVariants,
      rounded: badgeRoundedVariants,
      border: {
        true: "border",
        false: "",
      },
    },
    defaultVariants: {
      color: "neutral",
      size: "md",
      rounded: "md",
      border: false,
    },
  }
);

export function AdvancedColorfulBadges({
  color,
  size,
  rounded,
  border = true,
  children,
  className,
  ...props
}: Readonly<
  {
    className?: string;
    children: ReactNode;
    onClick?: () => void;
  } & VariantProps<typeof badgesVariants>
>) {
  return (
    <div
      className={cn(
        badgesVariants({ color, rounded, size, border }),
        className
      )}
      onClick={props.onClick}
      {...props}
    >
      {children}
    </div>
  );
}
