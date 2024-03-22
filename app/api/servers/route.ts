import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid'
export async function POST(request: NextRequest) {
    try {
        const { imageUrl, name } = await request.json();
        const user = await currentProfile();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const server = await db.server.create({
            data: {
                profileId: user.id,
                imageUrl,
                name,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        {
                            name: 'general',
                            profileId: user.id
                        }
                    ]
                },
                members: {
                    create: {
                        role: MemberRole.ADMIN,
                        profileId: user.id
                    }
                },
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log('[Server_Api]: ', error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}