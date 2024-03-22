// @ts-nocheck
import systemIPConfig from "@/SystemIPConfig";
import React, {useState, useEffect} from "react";
import axios from "axios";
import {
    Badge, Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    NavbarItem,
} from "@nextui-org/react";
import {NotificationIcon} from "../icons/navbar/notificationicon";

export const NotificationsDropdown = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${systemIPConfig.ipAddress}/get-notifications`);
            setNotifications(response.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const clearNotifications = async () => {
        try {
            await axios.post(`${systemIPConfig.ipAddress}/clear-notifications`);
            setNotifications([]);
        } catch (error) {
            console.error("Error clearing notifications:", error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await axios.post(`${systemIPConfig.ipAddress}/delete-notification`, {id: notificationId});
            setNotifications(notifications.filter(notification => notification.id !== notificationId));
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };
    const badgeContent = notifications.length > 0 ? notifications.length.toString() : null;

    useEffect(() => {
        const isRecording = localStorage.getItem("recording");
        if (isRecording === "false") {
            fetchNotifications();
        }
    }, [notifications]);


    return (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <NavbarItem>
                    <Badge content={badgeContent} color="danger" variant="solid" showOutline={false} size="sm"
                           isDot={true} style={{
                        position: 'absolute',
                        top: '7.5px',
                        left: '5px',
                    }}>
                        <NotificationIcon/>
                    </Badge>
                </NavbarItem>
            </DropdownTrigger>
            <DropdownMenu className="w-80" aria-label="Avatar Actions">
                <DropdownSection
                    title={<>
                        <span style={{
                            display: "inline-block",
                            position: "relative",
                            width: "100%",
                            top: "3px"
                        }}>
                            <span style={{float: "left"}}>Notifications</span>
                            {notifications.length > 0 && (
                                <span style={{position: "absolute", top: 0, right: 0}}>
                                    <Button
                                        variant={"ghost"}
                                        size="sm" onClick={clearNotifications} style={{height: "50%"}}>
            Clear All
                                    </Button>
                                </span>
                            )}
                        </span>
                    </>
                    }
                >
                    {notifications.map((notification) => (
                        <DropdownItem
                            key={notification.id}
                            classNames={{
                                base: "py-2",
                                title: "text-base font-semibold",
                            }}
                            description={notification.description}
                        >
                            {notification.icon} {notification.message}
                            <Button variant="text" color="error" size="sm"
                                    onClick={() => deleteNotification(notification.id)}>Delete</Button>
                        </DropdownItem>
                    ))}
                    {notifications.length == 0 && (
                        <DropdownItem
                            classNames={{
                                base: "py-2",
                                title: "text-base font-semibold",
                            }}
                        >
                            No new notifications
                        </DropdownItem>
                    )}
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    );
};