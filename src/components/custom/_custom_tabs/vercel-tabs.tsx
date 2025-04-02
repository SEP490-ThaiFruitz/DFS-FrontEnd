"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Tab {
  id: string;
  label: string;

  icon?: LucideIcon;

  content?: React.ReactNode;
}

interface VercelTabProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;

  classNameIcon?: string;

  classNameContent?: string;
}

const VercelTab = React.forwardRef<HTMLDivElement, VercelTabProps>(
  (
    {
      className,
      tabs,
      activeTab,
      onTabChange,
      classNameContent,
      classNameIcon,
      ...props
    },
    ref
  ) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [hoverStyle, setHoverStyle] = useState({});
    const [activeStyle, setActiveStyle] = useState({
      left: "0px",
      width: "0px",
    });
    const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
      if (hoveredIndex !== null) {
        const hoveredElement = tabRefs.current[hoveredIndex];
        if (hoveredElement) {
          const { offsetLeft, offsetWidth } = hoveredElement;
          setHoverStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          });
        }
      }
    }, [hoveredIndex]);

    useEffect(() => {
      const activeElement = tabRefs.current[activeIndex];
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement;
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      }
    }, [activeIndex]);

    useEffect(() => {
      requestAnimationFrame(() => {
        const firstElement = tabRefs.current[0];
        if (firstElement) {
          const { offsetLeft, offsetWidth } = firstElement;
          setActiveStyle({
            left: `${offsetLeft}px`,
            width: `${offsetWidth}px`,
          });
        }
      });
    }, []);

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <div className="relative">
          {/* Hover Highlight */}
          <div
            className="absolute h-[30px] transition-all duration-300 ease-out bg-[#0e0f1114] dark:bg-[#ffffff1a] rounded-[6px] flex items-center"
            style={{
              ...hoverStyle,
              opacity: hoveredIndex !== null ? 1 : 0,
            }}
          />

          {/* Active Indicator */}
          <div
            className="absolute bottom-[-6px] h-[2px] bg-[#0e0f11] dark:bg-white transition-all duration-300 ease-out"
            style={activeStyle}
          />

          {/* Tabs */}
          <div className="relative flex space-x-[6px] items-center">
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                ref={(el: any) => (tabRefs.current[index] = el)}
                className={cn(
                  "px-6 py-4 cursor-pointer transition-colors duration-300 h-[30px]",
                  index === activeIndex
                    ? "text-[#0e0e10] dark:text-white bg-[#0e0f1114] rounded-[6px]"
                    : "text-[#0e0f1199] dark:text-[#ffffff99]"
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  setActiveIndex(index);
                  onTabChange?.(tab.id);
                }}
              >
                <div
                  className={cn(
                    "text-sm font-semibold leading-5 whitespace-nowrap flex items-center justify-center h-full",
                    classNameContent
                  )}
                >
                  {tab?.icon && (
                    <tab.icon
                      className={cn(
                        "size-6 text-slate-800 mr-1",
                        classNameIcon
                      )}
                    />
                  )}
                  {tab.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
VercelTab.displayName = "VercelTab";

export { VercelTab };
