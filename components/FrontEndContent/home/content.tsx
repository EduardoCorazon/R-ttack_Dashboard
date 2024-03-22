// @ts-nocheck
import systemIPConfig from "@/SystemIPConfig";
import React, {useEffect, useState} from "react";
import {TableWrapper} from "@/components/FrontEndContent/table/table";
import {RecordRFCard} from "./QuickActionsCards/RecordRFCard";
import {JammingAttackCard} from "./QuickActionsCards/JammingAttackCard";
import {ReplayAttackCard} from "./QuickActionsCards/ReplayAttackCard";
import {ProfilesCard} from "./OptionsCards/ProfilesCard";
import {RFGraphOptionsCard} from "./OptionsCards/RFGraphOptionsCard";
import {Link, Button} from "@nextui-org/react";
import NextLink from "next/link";
import SpectogramCharts from "@/components/Spectogram/SpectogramCharts";
import {Provider} from "react-redux";
import store from "@/components/store";
import {users as initialUsers} from '@/components/FrontEndContent/table/data';
import {RefreshIcon} from "@/components/FrontEndContent/icons/RefreshIcon";


export const Content = () => {
    const [filesMetadata, setFilesMetadata] = useState([]);
    const [users, setUsers] = useState(initialUsers);

    const fetchData = async () => {
        try {
            console.log("Fetch Data Called")
            const response = await fetch(`${systemIPConfig.ipAddress}/api/getAllFilesMetadata`);
            const data = await response.json();

            // Map the fetched data to the structure of users and append it
            const mappedData = data.map((item) => ({
                id: item.metadata.id,
                name: item.metadata.name,
                role: item.metadata.role,
                team: item.metadata.team,
                avatar: item.metadata.avatar,
                status: item.metadata.status,
                demodulation: item.metadata.demodulation,
                creationTime: item.metadata.creationTime,
                description: item.metadata.description,
                classification: item.metadata.classification,
                subclassification: item.metadata.subclassification,
                frequency: item.metadata.frequency,
            }));

            // Filter out existing users based on id
            const uniqueUsers = mappedData.filter((newUser) => !users.some((user) => user.id === newUser.id));
            users.push(...uniqueUsers);
            setFilesMetadata(data);

        } catch (error) {
            console.error(`Error fetching file metadata: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRefresh = () => {
        console.log("refreshing...")
        fetchData();
        console.log('Users');
        console.log(users);
    };

    return (
        <Provider store={store}>
            <div className="h-full lg:px-6">
                <div
                    className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
                    <div className="mt-6 gap-6 flex flex-col w-full">
                        {/* Card Section Top */}
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-semibold">Quick Actions</h3>
                            <div
                                className="grid md:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-5  justify-center w-full">
                                <RecordRFCard/>
                                <JammingAttackCard/>
                                <ReplayAttackCard/>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="h-full flex flex-col gap-2">
                            <h3 className="text-xl font-semibold">Radio Frequencies</h3>
                            <div className="w-full bg-default-50 shadow-lg rounded-2xl p-6 ">
                                <SpectogramCharts/>

                            </div>
                        </div>
                    </div>

                    {/* Left Section */}
                    <div className="mt-4 gap-2 flex flex-col xl:max-w-md w-full ">
                        <h3 className="text-xl font-semibold">Options</h3>
                        <div className="flex flex-col justify-center gap-4 flex-wrap md:flex-nowrap md:flex-col ">
                            <ProfilesCard users={users} setUsers={setUsers}/>
                            <RFGraphOptionsCard/>
                        </div>
                    </div>
                </div>

                {/* Table Latest Users */}
                <div className="flex flex-col justify-center w-full py-5 px-4 lg:px-0  max-w-[90rem] mx-auto gap-3">
                    <div className="flex  flex-wrap justify-between">
                        <h3 className="text-center text-xl font-semibold">
                            Latest Captures
                            <Button onClick={handleRefresh} variant="light" className="p-3 "
                                    endContent={<RefreshIcon/>}/>
                        </h3>

                        <Link
                            href="/captures"
                            as={NextLink}
                            color="primary"
                            className="cursor-pointer"
                        >
                            View All
                        </Link>
                    </div>
                    <TableWrapper users={users} setUsers={setUsers}/>
                </div>
            </div>
        </Provider>
    );
};