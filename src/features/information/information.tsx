"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import ProfileAvatar from '@/features/client/profile/information/avatar'
import InformationPersonal from '@/features/client/profile/information/information-personal'
import ProfilePassword from '@/features/client/profile/information/password'
import React from 'react'

function Information() {
    return (
        <Card className='cardStyle'>
            <CardHeader className="space-y-1">
                <CardTitle className="text-3xl font-bold">
                    Thông tin cá nhân
                </CardTitle>
            </CardHeader>
            <CardContent className="py-4 px-6">
                <ResizablePanelGroup
                    direction="horizontal"
                    className="min-h-[600px] rounded-lg"
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
            </CardContent>
        </Card>
    )
}

export default Information
