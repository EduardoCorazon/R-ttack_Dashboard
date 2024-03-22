// @ts-nocheck
"use client";
import {useEffect} from "react";

const RedirectToDashboard = () => {
    useEffect(() => {
        window.location.href = '/dashboard'
    }, []);
}

export default RedirectToDashboard;