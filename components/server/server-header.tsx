'use client'
import { ChevronDown, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DropdownMenuContent, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { ExitIcon } from "@radix-ui/react-icons";
import { useModal } from "@/hooks/use-modal-store";

export default function ServerHeader(
    {
        role,
        server
    }: {
        role?: MemberRole,
        server: ServerWithMembersWithProfiles
    }
) {
    const { onOpen } = useModal()
    const isAdmin = role === MemberRole.ADMIN
    const isModerator = isAdmin || role === MemberRole.MODERATOR

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="focus:outline-none "
                asChild
            >
                <button
                    className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
                >
                    {server.name}
                    <ChevronDown className="h-5 w-5 ml-auto" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 my-4 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px] bg-neutral-800"
            >
                {
                    isModerator && (
                        <DropdownMenuItem
                            onClick={() => {
                                onOpen("invite", { server })
                            }}
                            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer">
                            Invite People
                            <UserPlus className="h-4 ml-auto w-4" />
                        </DropdownMenuItem>
                    )
                }
                {
                    isAdmin && (
                        <DropdownMenuItem onClick={() => {
                            onOpen("editServer", { server })
                        }} className="px-3 py-2 text-sm cursor-pointer">
                            Server Settings
                            <Settings className="h-4 ml-auto w-4" />
                        </DropdownMenuItem>
                    )
                }
                {
                    isAdmin && (
                        <DropdownMenuItem  onClick={() => {
                            onOpen("manageMember", { server })
                        }} className="px-3 py-2 text-sm cursor-pointer">
                            Manage Members
                            <Users className="h-4 ml-auto w-4" />
                        </DropdownMenuItem>
                    )
                }
                {
                    isModerator && (
                        <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer">
                            Create Channel
                            <PlusCircle className="h-4 ml-auto w-4" />
                        </DropdownMenuItem>
                    )
                }
                {
                    isModerator && (
                        <DropdownMenuSeparator />
                    )
                }
                {
                    isAdmin && (
                        <DropdownMenuItem className="text-rose-400  px-3 py-2 text-sm cursor-pointer">
                            Delete Server
                            <Trash className="h-4 ml-auto w-4" />
                        </DropdownMenuItem>
                    )
                }
                {
                    !isAdmin && (
                        <DropdownMenuItem className="text-rose-400  px-3 py-2 text-sm cursor-pointer">
                            Leave Server
                            <ExitIcon className="h-4 ml-auto w-4" />
                        </DropdownMenuItem>
                    )
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}