"use client"
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized";
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog";
import { FormFileControl } from "@/components/global-components/form/form-file-control";
import { FormInputControl } from "@/components/global-components/form/form-input-control";
import { FormValues } from "@/components/global-components/form/form-values";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FormControl, FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { TableBody, TableCell, Table, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SliderSafeTypes } from '@/zod-safe-types/slider-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { CirclePlus, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

function SliderPage() {
    const [sliders] = React.useState([
        {
            title: 'Slider 1',
            isActive: true,
            image: "https://wowslider.com/sliders/demo-18/data1/images/hongkong1081704.jpg"
        },
        {
            title: 'Slider 2',
            isActive: true,
            image: "https://wowslider.com/sliders/demo-18/data1/images/shanghai.jpg"
        },
        {
            title: 'Slider 3',
            isActive: false, // Thay đổi để minh họa tùy chọn
            image: "https://wowslider.com/sliders/demo-18/data1/images/new_york.jpg"
        }
    ])
    const [slider, setSlider] = React.useState<{
        title: string,
        isActive: boolean,
        image: string
    }>()
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);

    const form = useForm<z.infer<typeof SliderSafeTypes>>({
        resolver: zodResolver(SliderSafeTypes),
    });

    const onSubmit = async (values: z.infer<typeof SliderSafeTypes>) => {
        console.log(values)
    };
    return (
        <div className='m-10'>
            <div className='flex justify-between items-center'>
                <p className='text-2xl font-semibold leading-none tracking-tight'>Thanh trượt</p>
                <Dialog open={isOpen} onOpenChange={() => {
                    setIsOpen(!isOpen)
                    setSlider(undefined)
                    form.reset()
                }}>
                    <DialogTrigger asChild>
                        <Button size={"sm"} className='text-white bg-green-500 hover:bg-green-600'>
                            <CirclePlus />
                            Tạo thanh trượt
                        </Button>
                    </DialogTrigger>
                    {isOpen && (
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{slider ? "Cập nhật " : "Tạo "}thanh trượt</DialogTitle>
                            </DialogHeader>
                            <FormValues form={form} onSubmit={onSubmit} classNameForm="grid gap-4 py-4">
                                <FormInputControl
                                    form={form}
                                    name="name"
                                    disabled={form.formState.isSubmitting}
                                    label="Tên thanh trượt"
                                    defaultValue={slider?.title}
                                    require
                                />
                                <Controller
                                    name="isActive"
                                    control={form.control}
                                    disabled={form.formState.isSubmitting}
                                    defaultValue={slider?.isActive ?? true}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between">
                                            <p className="text-sm font-medium">Trạng thái</p>
                                            <FormControl>
                                                <Switch
                                                    className={`${field.value ? "!bg-green-500" : "!bg-red-500"}`}
                                                    checked={field.value ?? false}
                                                    onCheckedChange={(checked) => field.onChange(checked)}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormFileControl
                                    form={form}
                                    name="image"
                                    disabled={form.formState.isSubmitting}
                                    label="Ảnh thanh trượt"
                                    type={"image/jpeg, image/jpg, image/png, image/webp"}
                                    require
                                    mutiple={false}
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <ButtonCustomized
                                            className="w-32 bg-slate-100 text-slate-900 hover:bg-slate-300"
                                            variant="outline"
                                            label="Hủy"
                                        />
                                    </DialogClose>

                                    <ButtonCustomized
                                        type="submit"
                                        className="min-w-32 px-2 max-w-fit bg-sky-600 hover:bg-sky-700"
                                        variant="secondary"
                                        disabled={form.formState.isSubmitting}
                                        label={
                                            form.formState.isSubmitting ? (
                                                <WaitingSpinner
                                                    variant="pinwheel"
                                                    label="Đang tạo..."
                                                    className="font-semibold "
                                                    classNameLabel="font-semibold text-sm"
                                                />
                                            ) : (
                                                "Lưu"
                                            )
                                        }
                                    />
                                </DialogFooter>
                            </FormValues>
                        </DialogContent>
                    )}
                </Dialog>
            </div>
            <div className="mt-10 border rounded-lg shadow-sm h-fit min-w-full max-w-6xl overflow-x-auto">
                <Table className='overflow-x-auto'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px] min-w-[300px]">Tên </TableHead>
                            <TableHead className="w-[200px] min-w-[300px]">Ảnh </TableHead>
                            <TableHead className="w-[200px] min-w-[200px]">Trạng thái</TableHead>
                            <TableHead className="w-fit min-w-[140px]">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sliders.map((slider) => <TableRow key={slider.title}>
                            <TableCell className="font-bold">{slider.title}</TableCell>
                            <TableCell>
                                <Image src={slider.image} width={200} height={100} alt={slider.title} />
                            </TableCell>
                            <TableCell>
                                {slider.isActive ? (
                                    <p className="w-fit rounded-lg bg-green-50 text-green-600 py-1 px-2">Hoạt động</p>
                                ) : (
                                    <p className="w-fit rounded-lg bg-red-50 text-red-600 py-1 px-2">Không hoạt động</p>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                                        onClick={() => {
                                            setIsOpen(true)
                                            setSlider(slider)
                                        }}
                                    >
                                        <Pencil />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                        onClick={() => {
                                            setSlider(slider)
                                            setIsOpenDelete(true)
                                        }}
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </div>
            {/* <DeleteDialog id={slider?.title ?? ""} onClose={() => {
                setSlider(undefined);
                setIsOpenDelete(false);
            }} name={slider?.title ?? ""} deleteFunction={} isOpen={isOpenDelete} /> */}
        </div>
    )
}

export default SliderPage