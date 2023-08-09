import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");
  const storeClient = await db.store.findFirst({
    where: {
      userId,
    },
  });
  if (storeClient) {
    return redirect(`/${storeClient.id}`);
  }
  return <>{children}</>;
}
