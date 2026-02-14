import { useState } from "react";
import { Outlet } from "react-router-dom";
import AsideBar from "./AsideBar";
import TopBar from "./TopBar";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <AsideBar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />

      <div
        className={`transition-all duration-300 ${
          collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        }`}
      >
        <TopBar onMenuToggle={() => setCollapsed((c) => !c)} />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
