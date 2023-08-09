import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Navbar from "@/components/navbar/Navbar";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    storeId: string;
  };
}) {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");
  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });
  if (!store) return redirect("/billboards");
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
