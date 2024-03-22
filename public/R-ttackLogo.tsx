// @ts-nocheck
import React from 'react';
import './R-ttackLogoStyle.css'; // You can create a separate CSS file for styling

const RttackLogo = () => {
    return (
        <div >
            <div style={{textAlign: "center"}}>
                <b style={{color: "red"}}>R</b>
                <b>-TTACK</b>
            </div>
            <div className="subtext">
                <span style={{marginTop: "10px"}}>RF testing</span>
            </div>
        </div>
    );
}

export default RttackLogo;
