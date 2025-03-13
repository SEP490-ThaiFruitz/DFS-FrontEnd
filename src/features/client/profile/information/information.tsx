"use client"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import React from 'react'
import ProfileAvatar from './avatar'
import { Separator } from '@/components/ui/separator'
import ProfilePassword from './password'
import InformationPersonal from './information-personal'

const InformationTab = () => {
    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[600px] rounded-lg border bg-card"
        >
            <ResizablePanel defaultSize={40} minSize={30} className="p-4">
                <div className="flex flex-col gap-6">
                    <ProfileAvatar />
                    <Separator className="bg-purple-200" />
                    <ProfilePassword />
                </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-purple-200" />

            <ResizablePanel defaultSize={60} minSize={40} className="p-4">
                <InformationPersonal />
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default InformationTab
