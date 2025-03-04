import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function InvitePage({ params }: { params: { inviteCode: string } }) {
    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn()
    }

    if (!params.inviteCode) {
        return redirect('/')
    }

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (existingServer) {
        return redirect(`/server/${existingServer.id}`)
    }

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,

        },
        data: {
            members: {
                create: {
                    profileId: profile.id
                }
            }
        }
    })

    if (server) {
        return redirect(`/servers/${server.id}`)
    }

    return null;
}