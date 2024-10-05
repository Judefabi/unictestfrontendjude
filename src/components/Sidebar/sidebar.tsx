"use client";
import { DASHBOARD_ITEMS } from "@/constants";
import Link from "next/link";
import { IoAdd } from "react-icons/io5";
import SidebarFooter from "../SidebarFooter/SideBarFooter";

const SideNavigation = () => {
  return (
    <nav className="hidden lg:flex sticky  mt-10 w-[360px] h-[calc(100vh-4rem)] bg-background border-r flex-col overflow-hidden justify-between">
      {/* Internal Content that scrolls */}
      <div className="h-full overflow-y-auto overflow-x-hidden p-5 scroll-bar ">
        {/* Add New Chart Section */}
        <div className="mb-20">
          <div className="bg-[#2AABBC] flex items-center space-x-2 p-3 rounded-full my-5 cursor-pointer">
            <IoAdd />
            <div>New Chart</div>
          </div>

          {/* Dashboard Items */}
          {DASHBOARD_ITEMS.map((dashboardItem) => {
            const Icon = dashboardItem.icon;
            return (
              <div key={dashboardItem.id}>
                <div className="font-semibold text-label-large flex items-center py-5 gap-x-2">
                  <Icon className="text-body-large font-medium" />
                  {dashboardItem.label}
                </div>
                <ul className="list-none">
                  {dashboardItem.items &&
                    dashboardItem.items.map((item: any) => (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          className="flex w-full cursor-pointer text-gray-600 duration-200 py-4 px-5 rounded-xl flex-row items-center ml-6 ">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            );
          })}
        </div>
        {/* Footer section of the sidebar that contains additional functonalities that are not aprt of the navigation */}
        <SidebarFooter />
      </div>
    </nav>
  );
};

export default SideNavigation;
