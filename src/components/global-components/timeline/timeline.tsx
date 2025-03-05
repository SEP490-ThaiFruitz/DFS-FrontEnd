"use client"

import { LucideIcon } from "lucide-react"
interface TimelineProps {
    orientation?: "Horizontal" | "Vertical",
    showIcon?: boolean
    events: TimelineEvent[],
    classNameIcon?: string,
    clasNameIsCompleted?: string,
    clasNameNotIsCompleted?: string,
    clasNameTimeline?: string,
}

export interface TimelineEvent {
    icon: LucideIcon,
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
    clasNameIsCompleted = 'bg-green-500 text-white',
    clasNameNotIsCompleted = 'bg-gray-200 text-gray-500',
    clasNameTimeline = 'w-16 h-16 rounded-full flex items-center justify-center z-10 mb-2' }
    : Readonly<TimelineProps>) => {
    const getProgress = () => {
        const lastCompletedIndex = events.findLastIndex((event) => event.completed);
        if (lastCompletedIndex === -1) return '0%';
        return `${(lastCompletedIndex / (events.length - 1)) * 100}%`;
    };

    return (
        <div className="w-full px-10 sm:px-20 py-8 bg-white">
            <div className="relative">
                <div className={`${orientation === "Vertical" ? 'top-0 bottom-0 left-8 w-0.5 my-10' : 'left-0 right-0 sm:mx-20 h-0.5 top-8'} absolute bg-gray-200`}>
                    <div
                        className={`absolute ${orientation === "Vertical" ? 'w-full top-0 bottom-0 left-0' : 'h-full top-0 left-0'} bg-green-500 transition-all duration-300`}
                        style={{ width: getProgress() }}
                    />
                </div>

                <div className={`flex justify-between relative ${orientation === "Vertical" ? 'flex-col gap-10' : ''}`}>
                    {events.map((event, index) => (
                        <div key={index + 1} className={`flex items-center ${orientation === "Vertical" ? 'flex-row space-x-5' : 'flex-col'}`}>
                            <div
                                className={`${clasNameTimeline} ${event.completed ? clasNameIsCompleted : clasNameNotIsCompleted
                                    }`}
                            >
                                {showIcon && event.icon && <event.icon className={classNameIcon} />}
                            </div>
                            <div className={`${orientation === "Vertical" ? 'text-left' : 'text-center'} mt-2`}>
                                <p className="font-medium text-sm sm:text-base">{event.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Timeline
