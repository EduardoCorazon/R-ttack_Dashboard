// @ts-nocheck
import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import {DarkModeSwitch} from "./darkmodeswitch";
import {authenticateTest, logout} from "@/components/Authentication/useClient";

export const UserDropdown = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const authenticatedUser = await authenticateTest();

            if (authenticatedUser) {
                setUser(authenticatedUser);
            } else {
                console.error('User not authenticated. Redirecting to login page.');
            }
        };
        fetchData();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await logout();
            document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            console.log('Logout successful:', response);
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="secondary"
                    name="Jason Hughes"
                    size="sm"
                    //src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                    src="https://avatars.githubusercontent.com/u/79670342?v=4"
                />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat"
                          onAction={(actionKey) => console.log({actionKey})}>
                <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in</p>
                    <p className="font-semibold">
                        {user ? (
                            <p>Hello, {user.username}!</p>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </p>
                </DropdownItem>
                <DropdownItem onClick={() => window.location.href = '/settings'} key="settings">My
                    Settings</DropdownItem>
                <DropdownItem key="team_settings">Team Settings</DropdownItem>
                <DropdownItem key="analytics">Analytics</DropdownItem>
                <DropdownItem key="system">System</DropdownItem>
                <DropdownItem key="configurations">Configurations</DropdownItem>
                <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                <DropdownItem onClick={handleLogout} key="logout" color="danger">
                    Log Out
                </DropdownItem>
                <DropdownItem key="switch">
                    <DarkModeSwitch/>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};