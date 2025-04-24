"use client"

import type React from "react"

import { useState } from "react"
import { Tabs,  TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImportTab from "./import"
import ExportTab from "./export"

export default function Create() {
    const [tab, setTab] = useState("import");

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Tạo xuất nhập kho</h2>
                <p className="text-muted-foreground">Thêm sản phẩm mới vào kho hoặc xuất sản phẩm ra khỏi kho</p>
            </div>

            <Tabs defaultValue="import" value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="import">Nhập kho</TabsTrigger>
                    <TabsTrigger value="export">Xuất kho</TabsTrigger>
                </TabsList>
                <ImportTab />
                <ExportTab />
            </Tabs>
        </div>
    )
}
