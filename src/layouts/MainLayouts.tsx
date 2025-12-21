import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
