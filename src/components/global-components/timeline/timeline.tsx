"use client"

import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import React from "react"

interface TimelineProps {
  orientation?: "Horizontal" | "Vertical"
  showIcon?: boolean
  events: TimelineEvent[]
  classNameIcon?: string
  classNameTimeline?: string
  classNameIsCompleted?: string
  classNameNotIsCompleted?: string
  className?: string
}

export interface TimelineEvent {
  icon?: LucideIcon
  title: string
  date?: string
  completed: boolean
  subEvents?: SubEvent[]
}

interface SubEvent {
  title: string
  date: string
}

const Timeline = ({
  orientation = "Horizontal",
  showIcon = false,
  events,
  classNameIcon,
  classNameTimeline,
  classNameIsCompleted = "bg-green-500 text-white",
  classNameNotIsCompleted = "bg-gray-200 text-gray-500",
  className = "w-full sm:px-16 md:px-20 py-8 bg-white",
}: Readonly<TimelineProps>) => {
  const getProgress = () => {
    if (events.length === 0) return "0%"
    const index = events.findLastIndex((x) => x.completed)
    if (index === -1) return "0%"
    return `${(index / (events.length - 1)) * 100}%`
  }

  const isVertical = orientation === "Vertical"

  if (isVertical) {
    return (
      <div className={className}>
        <div className=" flex flex-col gap-10">
          <div className="relative flex flex-col gap-10">
            {events.slice().reverse().map((event: TimelineEvent, index) => (
              <React.Fragment key={index + 1}>
                <div className="flex flex-row items-center space-x-5">
                  <div
                    className={cn(
                      "flex items-center justify-center z-10 rounded-full w-16 h-16 flex-shrink-0",
                      event.completed ? classNameIsCompleted : classNameNotIsCompleted,
                      classNameTimeline
                    )}
                  >
                    {showIcon && event.icon && <event.icon className={classNameIcon} />}
                  </div>
                  <div className="text-left mt-2">
                    <div className="font-medium text-sm">{event.title}</div>
                    {event?.date && (
                      <div className="text-xs text-gray-500 mt-1">{formatTimeVietNam(new Date(event.date), true)}</div>
                    )}
                  </div>
                </div>
                {event?.subEvents?.slice().reverse().map((subEvent: SubEvent, indexSubEvent: number) => (
                  <div key={`${index},${indexSubEvent}`} className="flex items-center flex-row space-x-5 ml-10">
                    <div className="bg-slate-400 z-10 rounded-full w-4 h-4 flex-shrink-0" />
                    <div className="text-left mt-2">
                      <div className="font-medium text-sm sm:text-base">{subEvent.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{formatTimeVietNam(new Date(subEvent.date), true)}</div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
            <div className="absolute top-0 bottom-0 left-3 w-0.5 bg-gray-200 mb-5">
              <div
                className="absolute w-full bottom-0 left-0 bg-green-500 transition-all duration-300"
                style={{ height: getProgress() }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="relative">
        <div className="absolute top-8 left-8 right-8 h-0.5 bg-gray-200 lg:mx-24">
          <div
            className="absolute h-full top-0 left-0 bg-green-500 transition-all duration-300"
            style={{ width: getProgress() }}
          />
        </div>
        <div className="flex justify-between relative">
          {events.map((event, index) => (
            <div key={index + 1} className="flex flex-col items-center" style={{ width: `${100 / events.length}%` }}>
              <div
                className={cn(
                  "flex items-center justify-center rounded-full w-16 h-16 z-10",
                  event.completed ? classNameIsCompleted : classNameNotIsCompleted,
                  classNameTimeline
                )}
              >
                {showIcon && event.icon && <event.icon className={classNameIcon} />}
              </div>
              <div className="text-center mt-4 px-2 w-full">
                <div className="font-medium text-sm truncate">{event.title}</div>
                {event?.date && (
                  <div className="text-xs text-gray-500 mt-1 truncate">{formatTimeVietNam(new Date(event.date), true)}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Timeline