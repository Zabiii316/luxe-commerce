import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if ((session?.user as { role?: string } | undefined)?.role !== "admin") {
    redirect("/login");
  }

  return <>{children}</>;
}