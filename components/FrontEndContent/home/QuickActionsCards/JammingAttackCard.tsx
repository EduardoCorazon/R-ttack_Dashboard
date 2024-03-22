// @ts-nocheck
import SystemIPConfig from "@/SystemIPConfig";
import {Card, CardBody} from "@nextui-org/react";
import React, {useState} from "react";
import {Community} from "../../icons/community";
import {useSelector} from "react-redux";
import axios from "axios";
import '@/styles/DashboardStyle.css'

export const JammingAttackCard = () => {
    const metadata = useSelector((state) => state);
    const [isAttackingJamming, setIsAttackingJamming] = useState(() => {
        const storedStatus = localStorage.getItem("isAttacking");
        return storedStatus === "true" ? true : false;
    });

    const handleStopAttack = async () => {
        await axios.get(`${systemIPConfig.ipAddress}/stopAttack`);
        setIsAttackingJamming(false);
        localStorage.setItem("isRecording", "false");
    };

    const handleStartStopJammingAttack = async () => {
        try {
            if (isAttackingJamming) {
                handleStopAttack();
            } else {
                await axios.post(`${systemIPConfig.ipAddress}/setCaptureSettings`, {
                    frequency: metadata?.frequency,
                    sampleRate: metadata?.sampleRate,
                    gain: metadata?.gain,
                    demodulation: metadata?.demodulation,
                    type: 'Attack',
                    fileName: metadata?.name,
                });

                // Add logic to start the attack, for example:
                await axios.post(`${systemIPConfig.ipAddress}/menu`, {choice: 'ReplayAttack'});
            }
            setIsAttackingJamming(!isAttackingJamming); // Toggle isAttacking state
            localStorage.setItem("isAttacking", !isAttackingJamming ? "true" : "false");
        } catch (error) {
            console.error('Error during attack:', error.message);
        }
    };
    const isTextLong = metadata?.name && metadata.name.length > 10;

    return (
        <Card
            className={`xl:max-w-sm bg-${isAttackingJamming ? 'danger' : 'default-50'} rounded-xl shadow-md px-3 w-full`}
            isPressable onPress={handleStartStopJammingAttack}>
            <CardBody className="py-5">
                <div className="flex gap-2.5">
                    <Community/>
                    <div className="flex flex-col">
                        <span className="text-default-900">Jamming Attack</span>
                        <span className="text-default-900 text-xs">Block frequencies in range</span>
                    </div>
                </div>
                <div className="flex gap-2.5 py-2 items-center">
          <span className="text-default-900 text-xl font-semibold">
            {metadata?.frequency} MHz
          </span>
                    <span className="text-danger text-xs">- stopped</span>
                </div>
                <div className="flex items-center gap-6">
                    <div>
                        <div>
              <span
                  className={`font-semibold ${metadata?.sampleRate > 240000 ? 'text-danger' : 'text-success-600'} text-xs`}>
                {metadata?.sampleRate > 240000 ? "↓" : "↑"}
              </span>
                            <span className="text-xs">{metadata?.sampleRate}</span>
                        </div>
                        <span className="text-default-900 text-xs">SAMPLE RATE</span>
                    </div>

                    <div>
                        <div>
              <span className={`font-semibold ${metadata?.gain > 35 ? 'text-danger' : 'text-success-600'} text-xs`}>
                {metadata?.gain > 35 ? "↓" : "↑"}
              </span>
                            <span className="text-xs">{metadata?.gain}</span>
                        </div>
                        <span className="text-default-900 text-xs">GAIN</span>
                    </div>

                    <div>
                        <div style={{overflow: "hidden"}}>
                            <span className="font-semibold text-danger text-xs">{"⭐"}</span>
                            <span className={`text-xs ${isTextLong ? 'scroll-text' : ''}`}>
                {metadata?.name}
              </span>
                        </div>
                        <span className="text-default-900 text-xs">PROFILE</span>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};