import React from "react";
import { Outlet } from "react-router-dom";
import LeftRail from "./LeftRail";
import TopCommandBar from "./TopCommandBar";

export default function CommandCenter() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-ink">
      <TopCommandBar />
      <div className="flex min-h-0 flex-1">
        <LeftRail />
        <main className="relative min-h-0 flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}