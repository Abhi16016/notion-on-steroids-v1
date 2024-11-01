// Editor.tsx
"use client";

import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { Doc } from "@/lib/yjsSingleton";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { BlockNoteView } from "@blocknote/shadcn";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import stringToColor from "@/lib/stringToColor";
import TranslateDocument from "./TranslateDocument";
import ChatToDocument from "./ChatToDocument";

type EditorProps = {
    doc: InstanceType<typeof Doc>;
    provider: LiveblocksYjsProvider;
    darkMode: boolean;
};

function BlockNote({ doc, provider, darkMode }: EditorProps) {
    const userInfo = useSelf((me) => me.info);
    const [editorReady, setEditorReady] = useState(false);
    const [_editorError, setEditorError] = useState<Error | null>(null);

    const editor = useCreateBlockNote({
        collaboration: {
            provider,
            fragment: doc.getXmlFragment("document-store"),
            user: {
                name: userInfo?.name || "Anonymous",
                color: userInfo?.email ? stringToColor(userInfo.email) : "#000000",
            },
        },
        initialContent: [
            {
                type: "paragraph",
                content: "Welcome"
            }
        ],
        domAttributes: {
            editor: {
                class: "prose focus:outline-none max-w-full",
                "data-test": "editor",
            },
        },
    });

    useEffect(() => {
        if (provider) {
            const handleSync = (isSynced: boolean) => {
                if (isSynced) {
                    setTimeout(() => setEditorReady(true), 100);
                }
            };
            
            provider.on("sync", handleSync);
            
            return () => {
                provider.off("sync", handleSync);
            };
        }
    }, [provider]);

    if (_editorError) {
        return <div>Error loading editor. Please refresh the page.</div>;
    }

    if (!editorReady) {
        return <div>Loading editor...</div>;
    }

    return (
        <div className="relative max-w-6xl mx-auto">
            <BlockNoteView 
                className="min-h-screen"
                editor={editor}
                theme={darkMode ? "dark" : "light"}
            />
        </div>
    );
}

function Editor() {
    const room = useRoom();
    const [doc, setDoc] = useState<Y.Doc>();
    const [provider, setProvider] = useState<LiveblocksYjsProvider>();
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const yDoc = new Y.Doc();
        const yProvider = new LiveblocksYjsProvider(room, yDoc);

        // Initialize the document if empty
        const xmlFragment = yDoc.getXmlFragment("document-store");
        if (xmlFragment.length === 0) {
            const paragraphElement = new Y.XmlElement('paragraph');
            xmlFragment.push([paragraphElement]);
        }

        // Set awareness state
        const selfInfo = room.getSelf()?.info;
        yProvider.awareness.setLocalState({
            name: selfInfo?.name || "Anonymous",
            color: selfInfo?.email ? stringToColor(selfInfo.email) : "#000000",
        });

        setDoc(yDoc);
        setProvider(yProvider);

        return () => {
            yDoc?.destroy();
            yProvider?.destroy();
        };
    }, [room]);

    if (!doc || !provider) {
        return null;
    }

    const style = `hover:text-white ${
        darkMode
            ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
            : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
    }`;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 justify-end mb-10">
                {/* Translate Document */}
                <TranslateDocument doc={doc} />

                {/* Chat to Document */}
                <ChatToDocument doc={doc}/>

                {/* Dark Mode */}
                <Button className={style} onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? <SunIcon /> : <MoonIcon />}
                </Button>
            </div>

            <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
        </div>
    );
}

export default Editor;
