// pages/api/createDocument.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createNewDocument } from "@/actions/actions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { docId } = await createNewDocument(req); // Pass `req` if needed in `createNewDocument`
        res.status(200).json({ docId });
    } catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ error: "Failed to create document" });
    }
}
