import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { BadgeXIcon, ChevronDownIcon, ListRestartIcon, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

type TSelectData = {
  id: string;
  label: string;
  value: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  custom?: React.ReactNode;
  tags?: string[];

  image?: string;
};

type SelectProps = {
  data?: TSelectData[];
  onChange?: (value: string) => void;
  defaultValue?: string;

  title?: string;

  className?: string;

  onAction?: (value: string) => Promise<void>;
};

const AnimatedSelect = ({
  data,
  defaultValue,
  title,
  className,
  onChange,
  onAction,
}: SelectProps) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<TSelectData | undefined>(undefined);

  useEffect(() => {
    if (defaultValue) {
      const item = data?.find((i) => i.value === defaultValue);
      if (item) {
        setSelected(item);
      }
    } else {
      setSelected(data?.[0]);
    }
  }, [defaultValue]);

  const onSelect = (value: string) => {
    const item = data?.find((i) => i.value === value);
    setSelected(item as TSelectData);
    onChange?.(item?.id as string);
    setOpen(false);
  };

  const onReset = () => {
    setSelected(undefined);
    setOpen(false);
  };

  return (
    <MotionConfig
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        ease: "0.65, 0, 0.35, 1",
      }}
    >
      <motion.div className="flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {!open ? (
            <motion.div
              whileTap={{ scale: 0.95 }}
              animate={{
                borderRadius: 30,
              }}
              layout
              layoutId="dropdown"
              onClick={() => setOpen(true)}
              className="overflow-hidden rounded-[30px] border border-input bg-background shadow-sm"
            >
              <SelectItem item={selected} />
            </motion.div>
          ) : (
            <motion.div
              layout
              animate={{
                borderRadius: 20,
              }}
              layoutId="dropdown"
              className={cn(
                "overflow-hidden rounded-[20px] w-[400px] border border-input bg-background py-2 shadow-md",
                className
              )}
              ref={ref}
            >
              <Head setOpen={setOpen} title={title} reset={onReset} />
              <div className="w-full overflow-y-auto">
                {data?.map((item) => (
                  <SelectItem
                    order={item?.value}
                    noDescription={false}
                    key={item.id}
                    item={item}
                    onChange={onSelect}
                    tags={item?.tags}
                    onAction={onAction}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
  );
};

export default AnimatedSelect;

const Head = ({
  setOpen,
  title = "Các lựa chọn",
  reset,
}: {
  setOpen: (open: boolean) => void;
  title?: string;
  reset?: () => void;
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        delay: 0.1,
      }}
      layout
      className="flex items-center justify-between p-4"
    >
      <motion.strong layout className="text-foreground flex items-center ">
        {title}

        <Separator
          className="h-5 mx-2 w-[1px] bg-slate-500"
          orientation="vertical"
        />

        <ListRestartIcon
          className="text-foreground size-6 cursor-pointer hover:text-secondary-foreground transition-colors"
          onClick={reset}
        />
      </motion.strong>
      <button
        onClick={() => setOpen(false)}
        className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary"
      >
        <X className="text-secondary-foreground" size={12} />
      </button>
    </motion.div>
  );
};

type SelectItemProps = {
  item?: TSelectData;
  noDescription?: boolean;
  order?: string;
  tags?: string[];
  onChange?: (index: string) => void;
  onAction?: (value: string) => Promise<void>;

  image?: string;
};

const animation = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: (custom: number) => ({
      delay: custom * 0.1,
      duration: 0.5,
    }),
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: (custom: number) => ({
      delay: custom * 0.1,
    }),
  },
};

const SelectItem = ({
  item,
  noDescription = true,
  order,
  onChange,
  onAction,
}: SelectItemProps) => {
  return (
    <motion.div
      className={`group flex cursor-pointer items-center justify-between gap-2 p-4 py-2 hover:bg-accent hover:text-accent-foreground  w-full ${
        noDescription && "!p-2"
      }`}
      variants={animation}
      initial="hidden"
      animate="visible"
      exit="exit"
      key={"product-" + item?.id + "-order-" + order}
      custom={order}
      onClick={() => onChange?.(order as string)}
    >
      <div className="flex items-center gap-3 w-full">
        {item?.icon && (
          <motion.div
            layout
            layoutId={`icon-${item?.id}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-input"
          >
            {item?.icon}
          </motion.div>
        )}

        {item?.image && (
          <motion.div
            layout
            layoutId={`image-${item?.id}`}
            className="flex size-14 items-center justify-center rounded-full border border-input overflow-hidden"
          >
            <Image
              src={item?.image}
              height={56}
              width={56}
              alt={item.label}
              className="h-full w-full object-cover "
            />
          </motion.div>
        )}

        <motion.div
          layout
          className={`flex min-w-56 flex-col w-full ${
            onAction ? "relative" : ""
          }`}
        >
          <motion.strong
            layoutId={`label-${item?.id}`}
            className="text-sm font-semibold text-foreground line-clamp-2"
          >
            {item?.label}
          </motion.strong>
          {noDescription ? null : (
            <span className="truncate text-xs text-muted-foreground">
              {item?.description}
            </span>
          )}

          {item?.tags?.length && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {item?.tags?.slice(0, 3)?.map((tag, index) => (
                // <div className="flex items-center gap-1" key={index}>
                <span
                  key={index}
                  className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground font-semibold"
                >
                  {tag}
                </span>
                // </div>
              ))}
              <span className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground font-semibold">
                +{item?.tags?.length - 2}
              </span>
            </div>
          )}

          {onAction && (
            <BadgeXIcon
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onAction(item?.id as string);
              }}
              className="cursor-pointer absolute top-0 right-0 text-slate-700 hover:text-rose-600 transition-all duration-300 hover:rotate-12"
            />
          )}
        </motion.div>
      </div>
      {noDescription ? (
        <motion.div
          layout
          className="flex items-center justify-center gap-2 pr-3"
        >
          <ChevronDownIcon className="text-foreground" size={20} />
        </motion.div>
      ) : null}
    </motion.div>
  );
};
