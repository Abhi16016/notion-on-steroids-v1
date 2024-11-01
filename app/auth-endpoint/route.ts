import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    // Enforce authentication
    auth.protect();

    try {
        const { sessionClaims } = await auth();

        // Ensure sessionClaims are available
        if (!sessionClaims?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { room } = await req.json();

        // Validate if room is provided
        if (!room) {
            return NextResponse.json({ message: "Room ID is required" }, { status: 400 });
        }

        const session = liveblocks.prepareSession(sessionClaims.email!, {
            userInfo: {
                name: sessionClaims.fullName!, // Assert non-null with !
                email: sessionClaims.email!, // Assert non-null with !
                avatar: sessionClaims.image!, // Assert non-null with !
            },
        });

        const usersInRoom = await adminDb
            .collectionGroup("rooms")
            .where("userId", "==", sessionClaims.email!)
            .get();

        const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

        if (userInRoom?.exists) {
            session.allow(room, session.FULL_ACCESS);
            const { body, status } = await session.authorize();
            return new Response(body, { status });
        } else {
            return NextResponse.json(
                { message: "You are not authorized to access this room" },
                { status: 403 }
            );
        }
    } catch (error) {
        console.error("Auth endpoint error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
