// @ts-nocheck
"use client";

import * as React from "react";
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider} from 'next-themes'
import {Content} from "@/components/FrontEndContent/home/content";
import {Layout} from "@/components/FrontEndContent/layout/layout";

import AuthenticatedRoute from "@/components/Authentication/AuthenticatedRoute";

const AuthenticatedContent = AuthenticatedRoute(Content); // Wrap the Content component with AuthenticatedRoute

export default function Dashboard() {
    return (

        <ThemeProvider defaultTheme="system" attribute="class">
            <NextUIProvider>
                <Layout>
                    <AuthenticatedContent/>

                </Layout>
            </NextUIProvider>
        </ThemeProvider>
    )
}