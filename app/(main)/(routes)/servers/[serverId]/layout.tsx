import ServerSidebar from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function ServerIdLayout({ children, params }: { children: React.ReactNode, params: { [key: string]: string } }) {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    const servers = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (!servers) {
        return redirect('/')
    }

    return (
        <div className="">
            <div className="hidden md:flex h-full w-60 z-20 flex-col inset-y-0">
                <ServerSidebar serverId={params.serverId} /> 
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    )
}