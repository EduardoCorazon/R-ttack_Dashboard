// @ts-nocheck
import React from "react";

export const RefreshIcon = ({
                                fill = 'currentColor',
                                filled,
                                size,
                                height,
                                width,
                                label,
                                ...props
                            }) => {
    return (
        <svg width={size || width || 24}
             height={size || height || 24}
             viewBox="0 0 24 24" fill={filled ? fill : 'none'} xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M12 21C7.02944 21 3 16.9706 3 12C3 9.69494 3.86656 7.59227 5.29168 6L8 3M12 3C16.9706 3 21 7.02944 21 12C21 14.3051 20.1334 16.4077 18.7083 18L16 21M3 3H8M8 3V8M21 21H16M16 21V16"
                stroke={fill}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"/>
        </svg>
    );
};
