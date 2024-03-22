import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile();
        const { name, imageUrl } = await request.json()
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!params.serverId) {
            return new NextResponse("Server Id not provided", { status: 400 })
        }
        const server = await db.server.update({
            where: {
                profileId: profile.id,
                id: params.serverId
            },
            data: {
                name,
                imageUrl
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log('SERVER_ID_PATCH', error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}