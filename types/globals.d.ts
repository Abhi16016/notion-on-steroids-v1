import { User } from "./types";
import * as Y from "yjs";

declare global {
    interface CustomJwtSessionClaims extends User {
        email: string;
        fullName: string;
        image: string;
    }

    // Extend globalThis to include YjsInstance
    var YjsInstance: typeof Y | undefined;
}

export {};
