"use client"

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs"
import * as React from "react"
import Breadcrumbs from "./Breadcrumbs";



function Header() {

  const { user } = useUser();

  return <div className="flex justify-between items-center p-5">
    {user && (
      <h1 className="text-2xl">
        {user?.firstName}
        {`'s`} space
      </h1>
    )}

    {/* Breadcrumbs */}
    <Breadcrumbs />

    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>

      <SignedIn>
        <UserButton/>
      </SignedIn>
    </div>

    </div>
}

export default Header