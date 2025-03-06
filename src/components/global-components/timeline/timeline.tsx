"use client"

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react"
interface TimelineProps {
    orientation?: "Horizontal" | "Vertical",
    showIcon?: boolean
    events: TimelineEvent[],
    classNameIcon?: string,
    classNameIsCompleted?: string,
    classNameNotIsCompleted?: string,
    classNameTimeline?: string,
    classNameTimelinePositon?: string,
    className?: string,
}

export interface TimelineEvent {
    icon?: LucideIcon,
    title: string,
    date: string,
    completed: boolean,
    subEvents?: SubEvent[],
}

interface SubEvent {
    title: string,
    date: string,
}

const Timeline = ({
    orientation = 'Horizontal',
    showIcon = false,
    events,
    classNameIcon,
    classNameIsCompleted = 'bg-green-500 text-white',
    classNameNotIsCompleted = 'bg-gray-200 text-gray-500',
    classNameTimeline = 'w-16 h-16 mb-2',
    classNameTimelinePositon,
    className = 'w-full sm:px-16 md:px-20 py-8 bg-white' }
    : Readonly<TimelineProps>) => {
    const getProgress = () => {
        if (events.length === 0) return '0%';
        const index = events.findLastIndex(x => x.completed);

        return `${(index / (events.length - 1)) * 100}%`;
    };
    // top-0 bottom-0 left-8 w-0.5 my-10' : 'left-0 right-0 md:mx-20 h-0.5 top-8
    // 'w-full top-0 bottom-0 left-0' : 'h-full top-0 left-0'

    return (
        <div className={className}>
            <div className={`relative ${orientation === "Vertical" ? 'flex-col gap-10' : 'md:space-x-5'}`}>
                <div className={`${classNameTimelinePositon} absolute bg-gray-200`}>
                    <div
                        className={`absolute ${orientation === "Vertical" ? 'w-full top-0 bottom-0 left-0' : 'h-full top-0 left-0'} bg-green-500 transition-all duration-300`}
                        style={orientation === "Vertical" ? { height: getProgress() } : { width: getProgress() }}
                    />
                </div>

                <div className={`flex justify-between relative ${orientation === "Vertical" ? 'flex-col gap-10' : 'space-x-5'}`}>
                    {events.map((event: TimelineEvent, index) => (
                        <>
                            <div key={index + 1} className={`flex items-center ${orientation === "Vertical" ? 'flex-row space-x-5' : 'flex-col'}`}>

                                <div
                                    className={cn("flex items-center justify-center z-10 rounded-full", `${classNameTimeline} ${event.completed ? classNameIsCompleted : classNameNotIsCompleted}`)}
                                >
                                    {showIcon && event.icon && <event.icon className={classNameIcon} />}
                                </div>
                                <div className={`${orientation === "Vertical" ? 'text-left' : 'text-center'} mt-2`}>
                                    <p className="font-medium text-sm">{event.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                                </div>
                            </div>
                            {orientation === "Vertical" && event?.subEvents?.map((event: SubEvent, indexSubEvent: number) => (
                                <div key={`${index},${indexSubEvent}`} className={`flex items-center flex-row space-x-5 ml-10`}>
                                    <div className="bg-slate-400 z-10 rounded-full w-4 h-4" >
                                    </div>
                                    <div className={`${orientation === "Vertical" ? 'text-left' : 'text-center'} mt-2`}>
                                        <p className="font-medium text-sm sm:text-base">{event.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                                    </div>
                                </div>
                            ))}
                        </>

                    ))}
                </div>
            </div>
        </div>
    );
};

export default Timeline
