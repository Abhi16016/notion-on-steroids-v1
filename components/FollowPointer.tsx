import stringToColor from "@/lib/stringToColor";
import { motion } from "framer-motion";

function FollowPointer({
    x,
    y,
    info
}: {
    x: number;
    y: number;
    info: {
        name: string;
        email: string;
        avatar: string;
    };
}) {
    const color = stringToColor(info.email || '1');

    return (
        <motion.div
            className="absolute z-50 flex items-center gap-1"
            style={{
                top: y,
                left: x,
                pointerEvents: "none",
            }}
            initial={{
                scale: 1,
                opacity: 1,
            }}
            animate={{
                scale: 1,
                opacity: 1,
            }}
            exit={{
                scale: 0,
                opacity: 0,
            }}
        >
            {/* Custom Cursor SVG */}
            <svg
                fill={color}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transform -translate-x-2 -translate-y-2"
            >
                <path d="M4.5.79v22.42l6.56-6.57h9.29L4.5.79z"></path>
            </svg>

            {/* Name Label */}
            <motion.div
                style={{
                    backgroundColor: color,
                }}
                initial={{
                    scale: 0.9,
                    opacity: 0,
                }}
                animate={{
                    scale: 1,
                    opacity: 1,
                }}
                exit={{
                    scale: 0.9,
                    opacity: 0,
                }}
                className="px-2 py-1 text-black font-semibold whitespace-nowrap text-xs rounded-full shadow-sm"
            >
                {info?.name || info.email}
            </motion.div>
        </motion.div>
    );
}

export default FollowPointer;
