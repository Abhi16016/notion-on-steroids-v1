// yjsSingleton.ts
import * as Y from "yjs";

// Check if YjsInstance is already defined in globalThis
if (!globalThis.YjsInstance) {
    globalThis.YjsInstance = Y;
}

const YjsSingleton = globalThis.YjsInstance as typeof Y;
export default YjsSingleton;
export const { Doc } = YjsSingleton; // Export Doc directly for use
