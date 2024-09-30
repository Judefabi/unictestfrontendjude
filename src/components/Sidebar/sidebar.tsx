"use client";
import { DASHBOARD_ITEMS } from "@/constants";
import Link from "next/link";

const SideNavigation = () => {
  return (
    <nav className="border w-[360px] h-auto max-h-screen transition-all duration-300 p-3 flex flex-col justify-between overflow-y-auto overflow-x-hidden scroll-bar">
      <div className="flex flex-col h-full">
        {DASHBOARD_ITEMS.map((dashboardItem) => {
          const Icon = dashboardItem.icon;
          return (
            <div key={dashboardItem.label}>
              {/* Always show the label */}
              {dashboardItem.label ? (
                <>
                  <div className="font-semibold text-body-small flex items-center p-5 gap-x-2">
                    <Icon className={`text-body-large font-medium`} />
                    {dashboardItem.label}
                  </div>
                  <ul className="list-none">
                    {dashboardItem.items &&
                      dashboardItem.items.map((item: any) => (
                        <li key={item.path}>
                          <Link
                            href={item.path}
                            className="flex w-full cursor-pointer text-gray-600 duration-200 py-4 px-5 rounded-xl flex-row items-center ml-6">
                            {item.name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </>
              ) : (
                // For items without a label, just render the item
                <div className="font-semibold text-body-small flex items-center p-5 ">
                  <Icon className={`text-body-large font-medium`} />
                  {dashboardItem.name}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default SideNavigation;
