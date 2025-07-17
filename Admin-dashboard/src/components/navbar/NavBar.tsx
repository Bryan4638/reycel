import { Link, Outlet } from "react-router-dom";
import DropdownComp from "./DropdownMenu";
import SideBar from "./DrawerSideBar";
import Avatar from "./Avatar";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function NavBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 left-0 right-0 top-0 z-50 fixed">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex lg:w-4/5 items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 mr-3 text-gray-600 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 inline lg:hidden"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 12"
              >
                {" "}
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h14M1 6h14M1 11h7"
                />{" "}
              </svg>
            </button>
            <Link to={"/"} className="flex mr-4">
              <img src="logo.webp" className="mr-3 h-8" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white max-md:hidden">
                Admin Panel
              </span>
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white md:hidden">
                Admin
              </span>
            </Link>
          </div>
          <div className="flex items-center lg:order-2 space-x-2">
            {user?.role === "OWNER" && (
              <DropdownComp />
            )}
            <Avatar />
          </div>
        </div>
      </nav>
      <SideBar isOpen={sidebarOpen}  onOpenChange={toggleSidebar}/>
      <section className="max-w-screen 2xl:px-0 lg:ml-52 lg:pt-2 pt-5">
        <Outlet />
      </section>
    </>
  );
}

export default NavBar;
