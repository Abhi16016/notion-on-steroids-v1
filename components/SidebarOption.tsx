import { db } from "@/firebase"
import { doc } from "firebase/firestore"
import Link from "next/link" // Use Next.js Link
import { usePathname } from "next/navigation"
import { useDocumentData } from "react-firebase-hooks/firestore"

function SidebarOption({ href, id }: { href: string; id: string }) {
    const [data, _loading, _error] = useDocumentData(doc(db, "documents", id))
    const pathname = usePathname() || ""
    const isActive = href.includes(pathname) && pathname !== "/"

    if (!data) return null

    return (
        <Link href={href} className={`block text-center py-2 px-4 mb-4 rounded-md transition-all duration-200 ${isActive ? "bg-gray-100 font-semibold border border-gray-300" : "bg-white border border-gray-300 hover:bg-gray-50"}`}>
            <p className="truncate">{data.title || "Untitled Document"}</p>
        </Link>
    )
}

export default SidebarOption
