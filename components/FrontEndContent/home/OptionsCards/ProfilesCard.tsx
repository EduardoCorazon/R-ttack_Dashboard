// @ts-nocheck
import systemIPConfig from "@/SystemIPConfig";
import {Avatar, AvatarGroup, Card, CardBody, Autocomplete, AutocompleteItem, Button, Chip} from "@nextui-org/react";
import {SearchIcon} from "@nextui-org/shared-icons";
import React, {useState, useEffect} from "react";
import axios from "axios";
import {useDispatch} from "react-redux";

export const ProfilesCard = ({users, setUsers}) => {
    const [value, setValue] = React.useState("default");
    const [metadata, setMetadata] = useState(null);
    const dispatch = useDispatch();
    const getMetadata = async (value) => {
        try {
            const response = await axios.get(`${systemIPConfig.ipAddress}/api/getMetadata/${value}`);
            setMetadata(response.data);
            dispatch({type: 'SET_METADATA', payload: response.data});
        } catch (error) {
            console.error(`Error fetching metadata: ${error.message}`);
        }
    };

    const handleSelectionChange = (selectedValue) => {
        setValue(selectedValue);
        getMetadata(selectedValue);
    };

    useEffect(() => {
        getMetadata(value)
    }, []);

    return (
        <Card className=" bg-default-50 rounded-xl shadow-md px-4 py-6 w-full">
            <CardBody className="py-5 gap-6">
                <div className="flex gap-2.5 justify-center">
                    <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
            <span className="text-default-900 text-xl font-semibold">
              {" "}
                {"⭐"}Profiles
            </span>
                    </div>
                </div>
                <div className="flex items-center gap-6 flex-col">
          <span className="text-xs">
            Access all your captured frequencies here for easy access
          </span>
                    <AvatarGroup isBordered>
                        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d"/>
                        <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d"/>
                        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d"/>
                        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d"/>
                        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d"/>
                        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c"/>
                    </AvatarGroup>
                    <Autocomplete
                        classNames={{
                            base: "max-w-xs",
                            listboxWrapper: "max-h-[320px]",
                            selectorButton: "text-default-500"
                        }}
                        defaultItems={users}
                        inputProps={{
                            classNames: {
                                input: "ml-1",
                                inputWrapper: "h-[48px]",
                            },
                        }}
                        listboxProps={{
                            hideSelectedIcon: true,
                            itemClasses: {
                                base: [
                                    "rounded-medium",
                                    "text-default-500",
                                    "transition-opacity",
                                    "data-[hover=true]:text-foreground",
                                    "dark:data-[hover=true]:bg-default-50",
                                    "data-[pressed=true]:opacity-70",
                                    "data-[hover=true]:bg-default-200",
                                    "data-[selectable=true]:focus:bg-default-100",
                                    "data-[focus-visible=true]:ring-default-500",
                                ],
                            },
                        }}
                        aria-label="Select a saved capture"
                        placeholder="Enter a saved capture name"
                        popoverProps={{
                            offset: 10,
                            classNames: {
                                base: "rounded-large",
                            },
                        }}
                        startContent={<SearchIcon className="text-default-400" strokeWidth={2.5} size={20}/>}
                        radius="full"
                        variant="bordered"
                        selectedKey={value}
                        onSelectionChange={handleSelectionChange}
                    >
                        {(item) => (
                            <AutocompleteItem key={item.name} textValue={item.name}> {/*key={item.id}*/}
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2 items-center">
                                        <Avatar alt={item.name} className="flex-shrink-0" size="sm" src={item.avatar}/>
                                        <div className="flex flex-col">
                                            <span className="text-small">{item.name}</span>
                                            <Chip
                                                style={{marginTop: "5px"}}
                                                size="sm"
                                                variant="flat"
                                                color={
                                                    item.status === "Attack & Analyzed"
                                                        ? "success"
                                                        : item.status === "Attack Ready"
                                                            ? "danger"
                                                            : "warning"
                                                }
                                            >
                                                <span className="capitalize text-xs">{item.status}</span>
                                            </Chip>
                                        </div>
                                    </div>
                                    <Button
                                        className="border-small mr-0.5 font-medium shadow-small"
                                        radius="full"
                                        size="sm"
                                        variant="bordered"
                                    >
                                        Use
                                    </Button>
                                </div>
                            </AutocompleteItem>
                        )}
                    </Autocomplete>
                    <p>selected {value}</p>
                </div>
            </CardBody>
        </Card>

    );
};