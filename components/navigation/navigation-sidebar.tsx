import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import NavigationAction from "./navigation-action"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import NavigationItem from "./navigation-item"
import { ModeToggle } from "../mode-toggle"
import { UserButton } from "@clerk/nextjs"

export default async function NavigationSidebar() {
    const profile = await currentProfile()
    if (!profile) {
        redirect('/')
    }
    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    return <nav className="space-y-4 flex flex-col items-cecnter h-full text-primary py-4 w-full dark:bg-[#1e1f22]">
        <NavigationAction />
        <Separator
            className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
        />
        <ScrollArea className="flex-1 w-full ">
            {servers.map((item) => {
                return <div key={item.id} className="mb-4">
                    <NavigationItem
                        id={item.id}
                        imageUrl={item.imageUrl}
                        name={item.name}
                    />
                </div>
            })}
        </ScrollArea>
        <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
            <ModeToggle />
            <UserButton
                afterSignOutUrl="/"
                appearance={{
                    elements: {
                        avatarBox: 'h-[48px] w-[48px]'
                    }
                }}
            />
        </div>
    </nav>
}