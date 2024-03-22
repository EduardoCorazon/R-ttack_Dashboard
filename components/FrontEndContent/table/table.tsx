// @ts-nocheck
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import {columns_minimized} from "./data";
import {RenderCell} from "./render-cell";

export const TableWrapper = ({users, setUsers}) => {
    const visibleColumns = ["name", "role", "status", "actions"];
    const sortedUsers = users
        .sort((a, b) => (b.creationTime) - (a.creationTime))
        .slice(0, 10); // show only a max of 10 users

    return (
        <div className=" w-full flex flex-col gap-4">
            <Table aria-label="Example table with custom cells">
                <TableHeader columns={columns_minimized}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            hideHeader={column.uid === "actions"}
                            align={column.uid === "actions" ? "center" : "start"}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={sortedUsers}>
                    {(item) => (
                        <TableRow>
                            {(columnKey) => (
                                <TableCell>
                                    {RenderCell({user: item, columnKey: columnKey, users, setUsers})}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};