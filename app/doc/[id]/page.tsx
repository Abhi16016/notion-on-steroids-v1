"use client"

import Document from "@/components/Document"
import { useEffect, useState } from "react"

function DocumentPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const [id, setId] = useState<string | null>(null)

    useEffect(() => {
        async function fetchParams() {
            const resolvedParams = await params // Await the params Promise
            setId(resolvedParams.id) // Set the id from resolved params
        }

        fetchParams()
    }, [params])

    if (!id) return <div>Loading...</div> // Show loading while id is being resolved

    return (
        <div className="flex flex-col flex-1 min-h-screen">
            <Document id={id} />
        </div>
    )
}

export default DocumentPage
