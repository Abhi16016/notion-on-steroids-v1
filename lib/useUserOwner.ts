// userOwner.ts
"use client";

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react/suspense";
import { collection, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

export default function useUserOwner() {
    const { user } = useUser();
    const room = useRoom();
    const [isOwner, setIsOwner] = useState(false);

    // Get userEmail and roomId
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    const roomId = room?.id;

    // Only create the query if userEmail and roomId are defined
    const roomsQuery = userEmail && roomId
        ? query(
            collection(db, `users/${userEmail}/rooms`),
            where("roomId", "==", roomId)
          )
        : null;

    // Fetch users in the room
    const [usersInRoom] = useCollection(roomsQuery);

    // Check ownership based on usersInRoom changes
    useEffect(() => {
        if (!usersInRoom || !userEmail) return;

        const owners = usersInRoom.docs.filter(
            (doc) => doc.data().role === "owner"
        );

        const isUserOwner = owners.some(
            (owner) => owner.data().userId === userEmail
        );

        setIsOwner(isUserOwner);
    }, [usersInRoom, userEmail]);

    return isOwner;
}
