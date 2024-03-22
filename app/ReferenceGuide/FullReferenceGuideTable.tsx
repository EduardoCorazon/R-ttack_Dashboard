// @ts-nocheck
import systemIPConfig from "@/SystemIPConfig";
import React, {useEffect, useState} from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination, Popover, PopoverTrigger, PopoverContent, RadioGroup, Radio,
} from "@nextui-org/react";

import {ChevronDownIcon, SearchIcon} from "@nextui-org/shared-icons";
import {PlusIcon} from "@/components/FrontEndContent/icons/table/FullTableIcons/PlusIcon";
import {VerticalDotsIcon} from "@/components/FrontEndContent/icons/table/FullTableIcons/VerticalDotsIcon";
import {columns, statusOptions} from "@/components/ReferenceGuide/reference-guide-data";
import {capitalize} from "@/components/FrontEndContent/icons/table/FullTableIcons/utils";
import {users as initialUsers} from "@/components/ReferenceGuide/reference-guide-data";


const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "role", "status", "actions"];

export default function FullReferenceGuideTable() {
    const [users, setUsers] = useState(initialUsers);

    const fetchReferenceGuide = async () => {
        try {
            const response = await fetch(`${systemIPConfig.ipAddress}/api/getReferenceGuideList`)
            const ReferenceGuideData = await response.json();
            // Assuming referenceGuideData is an array of new users
            const updatedUsers = [...users, ...ReferenceGuideData];
            setUsers(updatedUsers);
        } catch (error) {
            console.error(`Error fetching file metadata: ${error.message}`);
        }
    }

    useEffect(() => {
        fetchReferenceGuide();
    }, []);

    const handleRefresh = () => {
        console.log("refreshing...")
        fetchReferenceGuide();
    };

    const handleDeleteDeviceReference = async (deviceId) => {
        try {
            const response = await fetch(`${systemIPConfig.ipAddress}/api/deleteDeviceReference/${deviceId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                console.log(`Device reference with ID ${deviceId} deleted successfully`);
                handleRefresh()
            } else {
                console.error(`Failed to delete device reference with ID ${deviceId}`);
            }
        } catch (error) {
            console.error('Error deleting device reference:', error);
        }
    };

    const [DeviceName, setDeviceName] = useState('');
    const [frequency, setFrequency] = useState('');
    const [source, setSource] = useState('');
    const [DeviceType, setDeviceType] = useState('');
    const handleAddDeviceReference = async () => {
        try {
            const newDeviceData = {
                name: DeviceName,
                frequency,
                source,
                type: DeviceType,
            };
            const response = await fetch(`${systemIPConfig.ipAddress}/api/addDeviceReference`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newDeviceData),
            });
            if (response.ok) {
                console.log('Device reference added successfully');
                handleRefresh();
            } else {
                console.error('Failed to add device reference');
            }
        } catch (error) {
            console.error('Error adding device reference:', error);
        }
    };

    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);
    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.name.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredUsers = filteredUsers.filter((user) =>
                Array.from(statusFilter).includes(user.status),
            );
        }

        return filteredUsers;
    }, [users, filterValue, statusFilter]);
    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "name":
                return (
                    <User
                        avatarProps={{radius: "lg", src: user.avatar}}
                        description={user.email}
                        name={cellValue}
                    >
                        {user.email}
                    </User>
                );
            case "role":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue}</p>
                        <p className="text-bold text-tiny capitalize text-default-400">{user.team}</p>
                    </div>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300"/>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem>View</DropdownItem>
                                <DropdownItem>Edit</DropdownItem>
                                <DropdownItem onClick={() => handleDeleteDeviceReference(user.id)}>Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by name..."
                        startContent={<SearchIcon/>}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small"/>} variant="flat">
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small"/>} variant="flat">
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Popover>
                            <PopoverTrigger>
                                <Button color="primary" endContent={<PlusIcon/>}>
                                    Add New
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-[240px]">
                                {(titleProps) => (
                                    <div className="px-1 py-2 w-full">
                                        <p className="text-small font-bold text-foreground" {...titleProps}>
                                            Capture Settings
                                        </p>
                                        <div className="mt-2 flex flex-col gap-2 w-full">
                                            <Input
                                                //value={DeviceName}
                                                onChange={(e) => setDeviceName(e.target.value)}
                                                label="Device Name:"
                                                size="sm"
                                                variant="bordered"
                                                type="text"
                                            />
                                            <Input
                                                //value={frequency}
                                                onChange={(e) => setFrequency(e.target.value)}
                                                label="Frequency (Mhz):"
                                                size="sm"
                                                variant="bordered"
                                                type="text"
                                            />

                                            <Input
                                                //value={DeviceType}
                                                onChange={(e) => setDeviceType(e.target.value)}
                                                label="Device Type:"
                                                size="sm"
                                                variant="bordered"
                                                type="text"
                                            />


                                            <Input
                                                //value={source}
                                                onChange={(e) => setSource(e.target.value)}
                                                label="Source/Info:"
                                                size="sm"
                                                variant="bordered"
                                            />
                                            <Button color="primary" onPress={handleAddDeviceReference}>Ready</Button>
                                        </div>
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {users.length} users</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
        users.length,
        onSearchChange,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
              ? "All items selected"
              : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (
        <Table
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-[382px]",
            }}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={"No users found"} items={sortedItems}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>

        </Table>
    );
}