"use client"

import { usePathname } from "next/navigation"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import React from "react"

function Breadcrumbs() {
    const path = usePathname() || ""

    // Split the path into segments
    const segments = path.split("/").filter(Boolean)

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {segments.map((segment, index) => {
                    if (!segment) return null

                    const href = `/${segments.slice(0, index + 1).join("/")}`
                    const isLast = index === segments.length - 1 

                    return (
                        <React.Fragment key={segment}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                            {isLast ? (
                                <BreadcrumbPage> {segment} </BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={href}>{segment}</BreadcrumbLink>
                            )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default Breadcrumbs
