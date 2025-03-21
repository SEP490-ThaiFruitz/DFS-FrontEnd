"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

type CategorySelect = {
    id: number | string
    name: string,
    thumbnail?: string;
}

interface CardCategoryProps {
    category: CategorySelect
    isChecked: boolean
    onChange: (isChoseCategory: boolean) => void
}

export const CardCategory = ({ category, isChecked, onChange }: Readonly<CardCategoryProps>) => {
    const [checked, setChecked] = useState(isChecked)

    useEffect(() => {
        setChecked(isChecked)
    }, [isChecked])

    const handleChange = () => {
        const newChecked = !checked
        setChecked(newChecked)
        onChange(newChecked)
    }

    return (
        <button
            type="button"
            onClick={handleChange}
            className={cn(
                "relative border p-1 shadow-md rounded-md text-center hover:cursor-pointer hover:scale-105",
                checked ? "border-2 border-green-500" : "hover:border-2 hover:border-green-500"
            )}
            key={category.id}
        >
            <Image
                src={category.thumbnail ?? "/images/dried-fruit.webp"}
                height={1000}
                width={1000}
                alt={category.name}
            />
            <span>{category.name}</span>
            {checked && <div className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full" />}
        </button>

    )
}

