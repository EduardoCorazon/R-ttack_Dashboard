// @ts-nocheck
import React from "react";
import {useTheme as useNextTheme} from "next-themes";
import {Switch} from "@nextui-org/react";
import {MoonIcon, SunIcon} from "@nextui-org/shared-icons";

export const DarkModeSwitchLogin = () => {
    const {setTheme, theme} = useNextTheme();
    return (
        <Switch

            isSelected={theme === "dark" ? true : false}
            onValueChange={(e) => setTheme(e ? "dark" : "light")}
            thumbIcon={({isSelected, className}) =>
                isSelected ? (
                    <SunIcon className={className}/>
                ) : (
                    <MoonIcon className={className}/>
                )
            }
        />
    );
};