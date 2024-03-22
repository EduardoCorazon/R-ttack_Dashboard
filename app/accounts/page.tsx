// @ts-nocheck
"use client";
import React from "react";
import {Accounts} from "@/components/FrontEndContent/accounts/accounts";
import {ThemeProvider} from "next-themes";
import {NextUIProvider} from "@nextui-org/react";
import {Layout} from "@/components/FrontEndContent/layout/layout";


const AccountsPage = () => {
    return (
        <ThemeProvider defaultTheme="system" attribute="class">
            <NextUIProvider>
                <Layout>
                    <div className="h-full lg:px-6">
                        <div
                            className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
                            <div className=" gap-6 flex flex-col w-full">
                                <Accounts/>
                            </div>
                        </div>
                    </div>
                </Layout>
            </NextUIProvider>
        </ThemeProvider>

    );
};

export default AccountsPage;