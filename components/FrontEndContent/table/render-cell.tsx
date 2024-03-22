// @ts-nocheck
import systemIPConfig from "@/SystemIPConfig";
import {User, Tooltip, Chip} from "@nextui-org/react";
import React from "react";
import {DeleteIcon} from "../icons/table/ShortTableIcons/delete-icon";
import {EditIcon} from "../icons/table/ShortTableIcons/edit-icon";
import {EyeIcon} from "../icons/table/ShortTableIcons/eye-icon";


interface RenderCellProps {
    user: {
        id: string;
        name: string;
        avatar: string;
        email: string;
        role: string;
        team: string;
        status: string;
        frequency: string;
        demodulation: string;
        description: string;
        classification: string;
        subclassification: string;
    };
    columnKey: string | React.Key;
    users: any[];
    setUsers: React.Dispatch<React.SetStateAction<any[]>>;
}

export const RenderCell = ({user, columnKey, users, setUsers}: RenderCellProps) => {

    const handleDeleteUser = async () => {
        try {
            // Make an API call to delete the user
            const response = await fetch(`${systemIPConfig.ipAddress}/api/deleteUser/${user.name}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
                console.log(`User ${user.name} deleted successfully`);
                // Optionally, you can update the UI or perform any other actions
            } else {
                console.error(`Failed to delete user ${user.name}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };


    // @ts-ignore
    const cellValue = user[columnKey];
    switch (columnKey) {
        case "name":
            return (
                <User
                    avatarProps={{
                        src: user.avatar,
                    }}
                    name={cellValue}
                >
                    {user.email}
                </User>
            );
        case "classification":
            return (
                <div>
                    <div>
                        <span>{cellValue}</span>
                    </div>
                    <div>
                        <span
                            className="text-bold text-tiny capitalize text-default-400">{user.subclassification}</span>
                    </div>

                </div>
            );
        case "frequency":
            return (
                <div>
                    <div>
                        <span>{cellValue} Mhz</span>
                    </div>
                </div>
            );

        case "status":
            return (
                <Chip
                    size="sm"
                    variant="flat"
                    color={
                        cellValue === "Attack & Analyzed"
                            ? "success"
                            : cellValue === "Attack Ready"
                                ? "danger"
                                : "warning"
                    }
                >
                    <span className="capitalize text-xs">{cellValue}</span>
                </Chip>
            );

        case "actions":
            return (
                <div className="flex items-center gap-4 ">
                    <div>
                        <Tooltip content="Details">
                            <button onClick={() => console.log("View user", user.id)}>
                                <EyeIcon size={20} fill="#979797"/>
                            </button>
                        </Tooltip>
                    </div>
                    <div>
                        <Tooltip content="Edit user" color="secondary">
                            <button onClick={() => console.log("Edit user", user.id)}>
                                <EditIcon size={20} fill="#979797"/>
                            </button>
                        </Tooltip>
                    </div>
                    <div>
                        <Tooltip
                            content="Delete user"
                            color="danger"
                        >
                            <button onClick={handleDeleteUser} disabled={user.name === 'default'}>
                                <DeleteIcon size={20} fill={user.name === 'default' ? '#A0A0A0' : '#FF0080'}/>
                            </button>
                        </Tooltip>
                    </div>
                </div>
            );
        default:
            return cellValue;
    }
};