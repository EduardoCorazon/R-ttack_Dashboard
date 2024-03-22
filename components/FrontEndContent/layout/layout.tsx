// @ts-nocheck
import React from "react";
import {useLockedBody} from "@/components/FrontEndContent/hooks/useBodyLock";
import {NavbarWrapper} from "@/components/FrontEndContent/navbar/navbar";
import {SidebarWrapper} from "@/components/FrontEndContent/sidebar/sidebar";
import {SidebarContext} from "./layout-context";

interface Props {
    children: React.ReactNode;
}

export const Layout = ({children}: Props) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [_, setLocked] = useLockedBody(false);
    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
        setLocked(!sidebarOpen);
    };

    return (
        <SidebarContext.Provider
            value={{
                collapsed: sidebarOpen,
                setCollapsed: handleToggleSidebar,
            }}
        >
            <section className="flex">
                <SidebarWrapper/>
                <NavbarWrapper>{children}</NavbarWrapper>
            </section>
        </SidebarContext.Provider>
    );
};