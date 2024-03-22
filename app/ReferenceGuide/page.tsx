// @ts-nocheck
"use client";
import {ThemeProvider} from "next-themes";
import {NextUIProvider} from "@nextui-org/react";
import {Layout} from "@/components/FrontEndContent/layout/layout";
import FullReferenceGuideTable from "@/app/ReferenceGuide/FullReferenceGuideTable";

export default function FullReferenceGuideTablePage() {
    return (
        <ThemeProvider defaultTheme="system" attribute="class">
            <NextUIProvider>
                <Layout>
                    <div className="h-full lg:px-6">
                        <div
                            className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
                            <div className="mt-6 gap-6 flex flex-col w-full">
                                <FullReferenceGuideTable/>
                            </div>
                        </div>
                    </div>
                </Layout>
            </NextUIProvider>
        </ThemeProvider>
    );
}