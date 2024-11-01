import RoomProvider from "@/components/RoomProvider";
import { auth } from "@clerk/nextjs/server";

async function DocLayout({
  children,
  params: paramsPromise, // Mark params as a promise
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>; // Mark params as a Promise
}) {
  const { id } = await paramsPromise; // Await the params Promise
  auth.protect(); // Ensure auth is protected

  return <RoomProvider roomId={id}>{children}</RoomProvider>;
}

export default DocLayout;
