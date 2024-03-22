'use client'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import axios from 'axios'
import { useModal } from '@/hooks/use-modal-store'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FileUpload from '../file-upload'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Server name is required.'
    }).max(1000, {
        message: 'Server name is too long.'
    }),
    imageUrl: z.string().min(1, {
        message: 'Server image is required.'
    }).max(1000, {
        message: 'Server image url is too long.'
    })
})

export default function EditServerModal() {
    const { isOpen, onClose, type, data } = useModal()
    const isModalOpen = isOpen && type === "editServer"
    const { server } = data;
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imageUrl: ''
        }
    })

    const isLoading = form.formState.isSubmitting;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await axios.patch(`/api/servers/${server?.id}`, values)
            form.reset();
            router.refresh()
        } catch (error) {
            console.log(error)
        }
    }
    const handleClose = () => {
        form.reset()
        onClose()
    }

    useEffect(() => {
        if (server) {
            form.setValue("name", server.name)
            form.setValue("imageUrl", server.imageUrl)
        }
    }, [server, form])

    return <Dialog open={isModalOpen} onOpenChange={handleClose}  >
        <DialogContent className="bg-white text-black p-0 overflow-hidden">

            <DialogHeader className="pt-8 px-6 ">

                <DialogTitle className='text-center font-bold text-2xl'>
                    Edit your server
                </DialogTitle>
                <DialogDescription className="text-center text-zinc-500 ">
                    Give your server a personality with a name and an image. You can always change it later
                </DialogDescription>
                <Form {...form} >
                    <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-8 ">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    name='imageUrl'
                                    control={form.control}
                                    render={({ field }) => {
                                        return (
                                            <FormItem className='flex flex-col'>
                                                <FormControl>
                                                    <FileUpload
                                                        endpoint="serverImage"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                            </div>


                            <FormField
                                name='name'
                                control={form.control}
                                render={({ field }) => {
                                    return (
                                        <FormItem className='flex flex-col'>
                                            <FormLabel className='uppercase text-sm text-start font-bold text-zinc-500 dark:text-secondary/70'>Server Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black foocus-visible:ring-offset-0'
                                                    placeholder="Enter server name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />

                        </div>

                        <DialogFooter className=' px-6 py-4'>
                            <Button variant="primary" disabled={isLoading}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogHeader>
        </DialogContent>
    </Dialog>
}