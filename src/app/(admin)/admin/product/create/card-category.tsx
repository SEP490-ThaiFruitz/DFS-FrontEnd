"use client"
import React, { useState } from 'react'
import { CategorySelect } from './page'
import Image from 'next/image'

interface CardCategoryProps {
    category: CategorySelect,
    onChange: (isChoseCategory: boolean) => void;
}

const CardCategory = ({ category, onChange }: Readonly<CardCategoryProps>) => {
    const [isChoseCategory, setIsChoseCategory] = useState<boolean>(category.isChose)
    const handlerChooseCategory = () => {
        if (isChoseCategory) {
            setIsChoseCategory(false)
            onChange(false);
        } else {
            setIsChoseCategory(true)
            onChange(true);
        }
    }
    return (
        <button type='button' onClick={handlerChooseCategory} className={`relative border p-1 shadow-md rounded-md text-center hover:cursor-pointer hover:scale-105 ${isChoseCategory ? 'border-2 border-green-500' : 'hover:border-2 hover:border-green-500'}`} key={category.id}>
            <Image src={category.thumbnail ?? "/images/dried-fruit.webp"} height={1000} width={1000} alt={category.name} />
            <p>{category.name}</p>
            {isChoseCategory && (<p className='absolute -top-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full' />)}
        </button>
    )
}

export default CardCategory
