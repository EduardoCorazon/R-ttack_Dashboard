// @ts-nocheck

import React from "react";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip } from "@nextui-org/react";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { DevIcon } from "../icons/sidebar/dev-icon";
import { ViewIcon } from "../icons/sidebar/view-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { useSidebarContext } from "@/components/FrontEndContent/layout/layout-context";
import { ChangeLogIcon } from "../icons/sidebar/changelog-icon";
import { useRouter } from "next/router";

export const SidebarWrapper = () => {
  //const router = useRouter();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <aside className="h-screen z-[202] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />

        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
                title="Home"
                icon={<HomeIcon/>}
                //isActive={router.pathname === "/"}
                href="/"
            />
            <SidebarMenu title="Main Menu">
              <SidebarItem
                  //isActive={router.pathname === "/accounts"}
                  title="Captures"
                  icon={<AccountsIcon/>}
                  href="/captures"
              />
              <SidebarItem
                  //isActive={router.pathname === "/payments"}
                  title="Flight Tracker"
                  icon={<PaymentsIcon/>}
                  href="https://www.flightradar24.com/airport/iah"
              />
              <CollapseItems
                  icon={<BalanceIcon/>}
                  //items={["Banks Accounts", "Credit Cards", "Loans"]}
                  //title="Balances"
                  items={[
                    {title: "Reference Guide", href: "/ReferenceGuide"},
                    {title: "Tactics & Techniques", href: "/tactics"},
                    {title: "Getting Started", href: "/start"},
                  ]}
                  title="Guides"
              />
              <SidebarItem
                  //isActive={router.pathname === "/customers"}
                  title="Accounts"
                  icon={<CustomersIcon/>}
                  href="/accounts"
              />
                <SidebarItem
                    //isActive={router.pathname === "/products"}
                    title="System Check"
                    icon={<ProductsIcon/>}
                />
                <SidebarItem
                    //isActive={router.pathname === "/reports"}
                    title="Reports"
                    icon={<ReportsIcon/>}
                />
            </SidebarMenu>

            <SidebarMenu title="General">
              <SidebarItem
                //isActive={router.pathname === "/developers"}
                title="Developers"
                icon={<DevIcon />}
              />
              <SidebarItem
                //isActive={router.pathname === "/view"}
                title="View Test Data"
                icon={<ViewIcon />}
              />
              <SidebarItem
                //isActive={router.pathname === "/settings"}
                title="Settings"
                icon={<SettingsIcon />}
                href="settings"
              />
            </SidebarMenu>

            <SidebarMenu title="Updates">
              <SidebarItem
                //isActive={router.pathname === "/changelog"}
                title="Changelog"
                icon={<ChangeLogIcon />}
              />
            </SidebarMenu>
          </div>
          <div className={Sidebar.Footer()}>
            <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Adjustments"} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content={"Profile"} color="primary">
              <Avatar
                src="https://avatars.githubusercontent.com/u/79670342?v=4"
                size="sm"
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  );
};
