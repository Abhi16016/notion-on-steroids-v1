"use client"

import { useTransition } from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useAuth } from "@clerk/nextjs"

function NewDocumentButton() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { isSignedIn } = useAuth() // Check if user is signed in

  const handleCreateNewDocument = () => {
    // Redirect to sign-in page if user is not signed in
    if (!isSignedIn) {
      router.push("/sign-in") // Redirects to Clerk's default sign-in page
      return
    }

    // If the user is signed in, proceed with document creation
    startTransition(async () => {
      const response = await fetch('/api/create', {
        method: 'POST',
      })

      if (response.ok) {
        const { docId } = await response.json()
        router.push(`/doc/${docId}`)
      } else {
        console.error('Failed to create document')
      }
    })
  }

  return (
    <Button onClick={handleCreateNewDocument} disabled={isPending}>
      {isPending ? "Creating..." : "New Document"}
    </Button>
  )
}

export default NewDocumentButton
