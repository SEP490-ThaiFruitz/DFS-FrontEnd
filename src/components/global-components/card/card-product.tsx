import StatusButton from "@/components/custom/_custom-button/status-button";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatVND } from "@/lib/format-currency";
import { truncate } from "lodash";
import Image from "next/image";

interface CardProductProps {
  // handleAddToCart: (e: React.MouseEvent) => void;
}
export const CardProduct = ({}: CardProductProps) => {
  return (
    <CardContainer className="inter-var cursor-pointer">
      <CardBody className="relative bg-gray-50 group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        <CardItem translateY={6} translateZ={6}>
          <Image
            src="/images/third-background.png"
            alt="Picture of the author"
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl cursor-pointer transition duration-300"
          />
        </CardItem>

        <CardItem
          translateX={10}
          translateY={10}
          className="text-violet-700/75 text-xl font-semibold mt-2 dark:text-neutral-300"
          as="h1"
        >
          Hover over this card to unleash the power of CSS perspective
        </CardItem>

        <CardItem
          translateX={10}
          translateY={15}
          className="text-neutral-500  mt-2 dark:text-neutral-300"
          as="h1"
        >
          {truncate(
            "Hover over this card to unleash the power of CSS perspective",
            { length: 80 }
          )}
        </CardItem>

        <div className="flex items-center justify-between">
          <CardItem
            translateY={10}
            translateZ={20}
            className="flex items-center gap-x-2"
          >
            <CardItem translateY={10} translateZ={10} as="del">
              {formatVND(20000)}
            </CardItem>
            <CardItem
              translateY={10}
              translateZ={10}
              as="h2"
              className="text-lg font-bold text-sky-500/70"
            >
              {formatVND(10000)}
            </CardItem>
          </CardItem>

          <CardItem translateY={10} translateZ={10} as="h4">
            <StatusButton handleAddToCart={() => {}} />
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
};
