// @ts-nocheck
import systemIPConfig from "@/SystemIPConfig";
import {
    Card,
    CardBody,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Input,
    Button,
    Switch,
    RadioGroup, Radio
} from "@nextui-org/react";
import React, {useState, useEffect} from "react";
import axios from "axios";
import {Community} from "../../icons/community";

export const RecordRFCard = () => {
    const [notifications, setNotifications] = useState([]);
    const AttackDoneNotification = async () => {
        try {
            const response = await axios.post(`${systemIPConfig.ipAddress}/notify-update`, {
                message: '📣 Capture ready for attack',
                description: 'Your attack ready .iq file is done processing. You can now use it for jamming or replay attacks.',
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error notifying backend:', error);
        }
    };
    const AnalyzingDoneNotification = async () => {
        try {
            const response = await axios.post(`${systemIPConfig.ipAddress}/notify-update`, {
                message: '📣 Capture Analyzed',
                description: 'Your Capture has been successfully analyzed and is ready to be viewed in the spectogram graphs below.',
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error notifying backend:', error);
        }
    };

    const [isOpen, setIsOpen] = React.useState(false);

    // Defaults
    const [frequency, setFrequency] = useState("94.5");
    const [sampleRate, setSampleRate] = useState("250000");
    const [gain, setGain] = useState("35");
    const [type, setType] = useState("Attack");
    const [demodulation, setDemodulation] = useState('wfm')
    const [fileName, setFileName] = useState("Capture1");


    const [metadata, setMetadata] = useState(null);
    const [isRecording, setIsRecording] = useState(() => {
        const storedStatus = localStorage.getItem("isRecording");
        return storedStatus === "true" ? true : false;
    });
    useEffect(() => {
        if (localStorage.getItem("isRecording") === null) {
            handleStatus();
        }
    }, []);


    const handleStop = async () => {
        await axios.get(`${systemIPConfig.ipAddress}/stop`);
        setIsRecording(false);
        localStorage.setItem("isRecording", "false");
    };

    const handleStartStop = async () => {
        if (isRecording) {
            await handleStop();
        } else {
            try {
                const response = await axios.post(`${systemIPConfig.ipAddress}/setCaptureSettings`, {
                    frequency,
                    sampleRate,
                    gain,
                    demodulation,
                    type,
                    fileName,
                });
                console.log('Backend response:', response.data);
            } catch (error) {
                console.error('Error sending data to the backend:', error.message);
            }
            if (type === 'Attack') {
                await axios.post(`${systemIPConfig.ipAddress}/menu`, {choice: 'RecAttack'});
                await AttackDoneNotification();
            } else if (type === 'Analyze') {
                await axios.post(`${systemIPConfig.ipAddress}/menu`, {choice: 'RecAnalyze'});
                await AnalyzingDoneNotification();
            } else {
                console.error('Invalid type selected');
                return;
            }
            setIsRecording(true);
            getMetadata(fileName);
            setIsOpen(false)
        }
        localStorage.setItem("isRecording", isRecording ? "false" : "true");
    };

    const handleStatus = async () => {
        try {
            const response = await axios.get(`${systemIPConfig.ipAddress}status`);
            const statusFromServer = response.data.lastItem;
            setIsRecording(statusFromServer.includes("0 Record"));
            localStorage.setItem("isRecording", statusFromServer.includes("0 Record") ? "true" : "false");
        } catch (error) {
            console.error('Error fetching status:', error.message);
        }
    };

    const getMetadata = async (filename) => {
        try {
            const response = await axios.get(`${systemIPConfig.ipAddress}/api/getMetadata/${filename}`);
            setMetadata(response.data);
        } catch (error) {
            console.error(`Error fetching metadata: ${error.message}`);
        }
    };

    return (
        <>
            <Popover placement="bottom" showArrow offset={10} backdrop={isRecording ? 'transparent' : 'opaque'}
                     isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                <PopoverTrigger>
                    <Card
                        className={`xl:max-w-sm bg-${isRecording ? 'danger' : 'primary'} rounded-xl shadow-md px-3 w-full`}
                        isPressable onPress={isRecording ? handleStop : null}>
                        <CardBody className="py-5">
                            <div className="flex gap-2.5">
                                <Community/>
                                <div className="flex flex-col">
                                    <span className="text-white">Record Radio Frequency</span>
                                    <span className="text-white text-xs">Save Radio Frequencies</span>
                                </div>
                            </div>

                            <div className="flex gap-2.5 py-2 items-center">
                                <span className="text-white text-xl font-semibold">{frequency} MHz</span>
                                <span
                                    className={`text-${isRecording ? 'danger' : 'success'} text-xs`}>{isRecording ? '- Stop Recording' : '+ Start Recording'}</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <div>
                                    <div>
                    <span className={`font-semibold ${sampleRate > 240000 ? 'text-danger' : 'text-success'} text-xs`}>
                      {sampleRate > 240000 ? "↓" : "↑"}
                    </span>
                                        <span className="text-xs text-white">{sampleRate}</span>

                                    </div>
                                    <span className="text-white text-xs">SAMPLE RATE</span>
                                </div>

                                <div>
                                    <div>
                    <span className={`font-semibold ${gain > 35 ? 'text-danger' : 'text-success'} text-xs`}>
                      {gain > 35 ? "↓" : "↑"}
                    </span>
                                        <span className="text-xs text-white">{gain}</span>
                                    </div>
                                    <span className="text-white text-xs">GAIN</span>
                                </div>

                                <div>
                                    <div>
                                        <span className="font-semibold text-danger text-xs">{"⭐"}</span>
                                        <span className="text-xs text-white">NEW</span>
                                    </div>

                                    <span className="text-white text-xs">PROFILE</span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </PopoverTrigger>

                <PopoverContent className="w-[240px]">
                    {(titleProps) => (
                        <div className="px-1 py-2 w-full">
                            <p className="text-small font-bold text-foreground" {...titleProps}>
                                Capture Settings
                            </p>
                            <div className="mt-2 flex flex-col gap-2 w-full">
                                <Input
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value)}
                                    label="Frequency (Mhz)"
                                    size="sm"
                                    variant="bordered"
                                    type="number"
                                    step="0.1"
                                />
                                <Input
                                    value={sampleRate}
                                    onChange={(e) => setSampleRate(e.target.value)}
                                    label="SampleRate"
                                    size="sm"
                                    variant="bordered"
                                    type="number"
                                />
                                <Input
                                    value={gain}
                                    onChange={(e) => setGain(e.target.value)}
                                    label="Gain"
                                    size="sm"
                                    variant="bordered"
                                    type="number"
                                />

                                <RadioGroup label="Demodulation"
                                            orientation="horizontal"
                                    //value={demodulation} enable for default value to appear
                                            value={demodulation}
                                            onChange={(e) => setDemodulation(e.target.value)}>
                                    <Radio value="fm">FM</Radio>
                                    <Radio value="wfm">WFM</Radio>
                                    <Radio value="raw">RAW</Radio>
                                    <Radio value="am">AM</Radio>
                                    <Radio value="usb">USB</Radio>
                                    <Radio value="lsb">LSB</Radio>
                                </RadioGroup>

                                <RadioGroup label="Type" orientation="horizontal" value={type}
                                            onChange={(e) => setType(e.target.value)}>
                                    <Radio value="Attack">Attack</Radio>
                                    <Radio value="Analyze">Analyze</Radio>
                                </RadioGroup>

                                <Input
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    label="File Name"
                                    size="sm"
                                    variant="bordered"
                                />
                                <Button color="primary" onPress={handleStartStop}
                                        isDisabled={fileName === "default"}>Ready</Button>
                            </div>
                        </div>
                    )}
                </PopoverContent>
            </Popover>
        </>
    );
};
