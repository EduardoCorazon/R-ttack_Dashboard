// @ts-nocheck
'use client';

import React, {useState} from 'react';
import {authenticate} from '@/components/Authentication/useClient';
import {EyeFilledIcon, EyeSlashFilledIcon} from "@nextui-org/shared-icons";

// Style
import '@/styles/LoginPageStyle.css'
import {Input, NextUIProvider, Button, CardBody, Card, Divider} from "@nextui-org/react";
import {DarkModeSwitch} from "@/components/FrontEndContent/navbar/darkmodeswitch";
import {ThemeProvider} from "next-themes";
import BackgroundAnimation from "@/app/login/BackgroundAnimation";
import SystemCheck from "@/components/SystemCheck/SystemCheck";

export default function LoginPage() {
    const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const credentials = {username, password};
            const response = await authenticate(credentials);
            console.log('Authentication successful:', response);
            window.location.href = '/dashboard';

        } catch (error) {
            setErrorMessage('Authentication failed. Please check your credentials.');
            console.error('Authentication error:', error);
        }
    };

    return (
        <>
            <ThemeProvider defaultTheme={storedTheme || "system"} attribute="class">
                <NextUIProvider>
                    <BackgroundAnimation/>
                    <div className="login-container">
                        <div className="logo-panel">
                            <Card style={{zIndex: "1"}}>
                                <CardBody>
                                    <div>
                                        <div style={{textAlign: "center"}}>
                                            <b style={{color: "red"}}>R</b>
                                            <b>-TTACK</b>
                                        </div>
                                        <div className="subtext">
                                            <span style={{marginTop: "10px"}}>RF Hacking & Testing</span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        <div className="left-panel">
                            <div className="left-panel-text" style={{zIndex: "1"}}>
                                <h1>Sign In to</h1>
                                <h2>R-TTACK Dashboards</h2>
                                <h3>A centralized web based RF Pentesting Tool</h3>

                            </div>
                        </div>

                        <div className="login-form-container">
                            <Card>
                                <CardBody>
                                    <form onSubmit={handleSubmit} className="login-form">
                                        <h2>Welcome back!</h2>
                                        <p>Need help? <SystemCheck/></p>

                                        <div className="form-group">
                                            <label htmlFor="username">Username</label>
                                            <Input
                                                type="text"
                                                id="username"
                                                name="username"
                                                placeholder="Enter your username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password</label>
                                            <Input
                                                id="password"
                                                name="password"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}

                                                required
                                                endContent={
                                                    <button className="focus:outline-none" type="button"
                                                            onClick={toggleVisibility}>
                                                        {isVisible ? (
                                                            <EyeSlashFilledIcon
                                                                className="text-2xl text-default-400 pointer-events-none"/>
                                                        ) : (
                                                            <EyeFilledIcon
                                                                className="text-2xl text-default-400 pointer-events-none"/>
                                                        )}
                                                    </button>
                                                }
                                                type={isVisible ? "text" : "password"}
                                                className="max-w-xs"
                                            />
                                        </div>
                                        <div className="error-message">{errorMessage && <p>{errorMessage}</p>}</div>
                                        <Divider className="my-4"/>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Button className="LoginButton" color="primary" type="submit">
                                                Login
                                            </Button>
                                            <div className="LoginThemeSwitch">
                                                <DarkModeSwitch/>
                                            </div>
                                        </div>
                                    </form>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </NextUIProvider>
            </ThemeProvider>
        </>
    );
}