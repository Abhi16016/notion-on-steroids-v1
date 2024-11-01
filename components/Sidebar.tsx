"use client"

import { MenuIcon } from "lucide-react"
import NewDocumentButton from "./NewDocumentButton"
import { useCollection } from "react-firebase-hooks/firestore"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { useUser } from "@clerk/nextjs"
import { collectionGroup, query, where, DocumentData } from "firebase/firestore"
import { db } from "@/firebase"
import { useEffect, useState } from "react"
import SidebarOption from "./SidebarOption"

interface RoomDocument extends DocumentData {
  createdAt: string
  role: "owner" | "editor"
  roomId: string
  userId: string
}

function Sidebar() {
  const user = useUser()
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[]
    editor: RoomDocument[]
  }>({
    owner: [],
    editor: [],
  })

  const [data, _loading, _error] = useCollection(
    user.isLoaded && user.isSignedIn && user.user
      ? query(
          collectionGroup(db, "rooms"),
          where("userId", "==", user.user.emailAddresses[0].emailAddress)
        )
      : null
  )

  useEffect(() => {
    if (!data) return

    const grouped = data.docs.reduce<{
      owner: RoomDocument[]
      editor: RoomDocument[]
    }>(
      (acc, curr) => {
        const roomData = curr.data() as RoomDocument

        if (roomData.role === "owner") {
          acc.owner.push({
            id: curr.id,
            ...roomData,
          })
        } else {
          acc.editor.push({
            id: curr.id,
            ...roomData,
          })
        }

        return acc
      },
      {
        owner: [],
        editor: [],
      }
    )

    setGroupedData(grouped)
  }, [data])

  const menuOptions = (
    <>
      <NewDocumentButton />


      <div className="flex py-4 flex-col space-y-4 md:max-w-36">
        {/* {My Documents} */}
        {groupedData.owner.length === 0 ? (
          <h2 className="text-gray-500 font-semibold text-sm text-center mt-2">
            No Documents Found
          </h2>
        ) : (
          <>
          <h2 className="text-gray-500 font-semibold text-sm">
            My Documents
          </h2>
          {groupedData.owner.map((doc) => (
            <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
          ))}
          </>
        )}



      {/* { Shared With Me } */}
      {groupedData.editor.length > 0 && (
        <>
          <h2 className="text-gray-500 font-semibold text-sm text-center mt-2">
            Shared with Me
          </h2>
          {groupedData.editor.map((doc) => (
            <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
          ))}
        </>
      )}
      </div>
       {/* {List} */}
    </>
  )

  return (
    <div className="p-2 md:pd-5 bg-gray-200 relative">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} />
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader className="flex flex-col items-center space-y-4">
              <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
              <div>{menuOptions}</div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:flex flex-col items-center space-y-4">
        <h1 className="text-lg font-bold">Menu</h1>
        {menuOptions}
      </div>
    </div>
  )
}

export default Sidebar
