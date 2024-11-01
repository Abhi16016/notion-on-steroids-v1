"use client"

import { FormEvent, useEffect, useState, useTransition } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useDocumentData } from "react-firebase-hooks/firestore"
import Editor from "./Editor"
import useUserOwner from "@/lib/useUserOwner"
import DeleteDocument from "./DeleteDocument"
import InviteUser from "./InviteUser"
import ManageUsers from "./ManageUsers"
import Avatars from "./Avatars"

function Document({id}: {id: string}) {
    const[data, _loading, _error] = useDocumentData(doc(db, "documents", id))
    const[input,setInput] = useState("")
    const[isUpdating, startTransition] = useTransition()
    const isOwner = useUserOwner() 

    useEffect(() => {
        if(data){
            setInput(data.title)
        }
    },[data])

    const updateTitle = (e: FormEvent) => {
        e.preventDefault()

        if(input.trim()) {
            startTransition(async () => {
                await updateDoc(doc(db, "documents", id), {
                    title: input,
                })
            })
        }
    }

  return (
    <div className="flex-1 h-full bg-white p-5">

        <div className="flex max-w-6xl mx-auto">
            <form onSubmit={updateTitle} className="flex flex-1 space-x-2 justify-between pb-5"> 
                {/* Update Title... */}
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)} />

                <Button disabled={isUpdating} type="submit">
                    {isUpdating ? "Updating" : "Update"}
                </Button>

                {/* IF */}

                {isOwner && (
                    <>
                    {/* Invite User */}
                    <InviteUser />
                    {/* Delete Document */} 
                    <DeleteDocument />
                    </>
                )}
                {/* isUser && InviteUser, DeleteDocument */}
            </form>
        </div>

        <div className="flex max-w-6x l mx-auto justify-between items-cetner mb-5">
            <ManageUsers />
        {/* {Manage Users} */}


        {/* {Avatars} */}
        <Avatars /> 
        </div>  
 
        <hr className="pb-10" />

        {/* {Collaborative Editor} */}
        <Editor />
    </div>

  )
}

export default Document