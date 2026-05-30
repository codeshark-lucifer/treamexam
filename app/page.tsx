import React from "react";
import { getCurrentUser } from "@/lib/auth/server";
import HomeClient from "./HomeClient";

export default async function Home() {
  const user = await getCurrentUser();

  return <HomeClient user={user} />;
}
