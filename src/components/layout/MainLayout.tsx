import { Outlet } from "react-router-dom";

import { GuideTour } from "@/components/guide/GuideTour";

import { Footer } from "./Footer";
import { Header } from "./Header";

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <GuideTour />
    </div>
  );
};
