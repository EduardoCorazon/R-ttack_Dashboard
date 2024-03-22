// @ts-nocheck
import systemIPConfig from "@/SystemIPConfig";
import {
    Card,
    CardBody,
    Radio,
    RadioGroup,
    Input,
    Tabs,
    Tab,
    Slider,
    Button,
    ButtonGroup,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Select, SelectItem, SelectSection, Tooltip, Accordion, AccordionItem
} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {ChevronDownIcon} from "@nextui-org/shared-icons";
import axios from "axios";
import ReferenceGuide from "@/components/ReferenceGuide/reference-guide";

export const RFGraphOptionsCard = () => {
    const metadata = useSelector((state) => state);
    const [frequency, setFrequency] = useState(metadata?.frequency);
    const [sampleRate, setSampleRate] = useState(metadata?.sampleRate);
    const [gain, setGain] = React.useState(metadata?.gain)
    const [type, setType] = useState("Attack");
    const [demodulation, setDemodulation] = useState(metadata?.demodulation)
    const [squeltch, setSqueltch] = useState('20')
    const [fileName, setFileName] = useState(metadata?.name);
    const [isRecordingAdvanced, setIsRecordingAdvanced] = useState(() => {
        const storedStatus = localStorage.getItem("isRecordingAdvanced");
        return storedStatus === "true" ? true : false;
    });

    useEffect(() => {
        if (localStorage.getItem("isRecordingAdvanced") === null) {
            handleStatus();
        }
    }, []);

    React.useEffect(() => {
        setDemodulation(metadata?.demodulation);
        setGain(metadata?.gain)
    }, [metadata?.demodulation]);


    const handleStop = async () => {
        await axios.get(`${systemIPConfig.ipAddress}/stop`);
        setIsRecordingAdvanced(false);
        localStorage.setItem("isRecordingAdvanced", "false");
    };

    const handleStatus = async () => {
        try {
            const response = await axios.get(`${systemIPConfig.ipAddress}/status`);
            const statusFromServer = response.data.lastItem;
            setIsRecordingAdvanced(statusFromServer.includes("0 Record"));
            localStorage.setItem("isRecordingAdvanced", statusFromServer.includes("0 Record") ? "true" : "false");
        } catch (error) {
            console.error('Error fetching status:', error.message);
        }
    };

    const handleButtonSelection = async (selectedOption) => {
        if (isRecordingAdvanced) {
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

            switch (selectedOption) {
                case 'Attack':
                    handleAttackButtonClick();
                    break;
                case 'Analyze':
                    handleAnalyzeButtonClick();
                    break;
                case 'Both':
                    handleBothAttackAnalyzeButtonClick();
                    break;
                default:
                    break;
            }
            setIsRecordingAdvanced(true);
        }
        localStorage.setItem("isRecordingAdvanced", isRecordingAdvanced ? "false" : "true");
    };

    const handleAttackButtonClick = async () => {
        if (fileName === "default") {
            console.log('Cannot record with default filename');
            setIsRecordingAdvanced(false)
        } else {
            await axios.post(`${systemIPConfig.ipAddress}/menu`, {choice: 'RecAttack'});
        }
    }

    const handleAnalyzeButtonClick = async () => {
        if (fileName === "default") {
            console.log('Cannot record with default filename');
            setIsRecordingAdvanced(false)
        } else {
            await axios.post(`${systemIPConfig.ipAddress}/menu`, {choice: 'RecAnalyze'});
        }
    };

    const handleBothAttackAnalyzeButtonClick = async () => {
        setIsRecordingAdvanced(false)
    }

    const [selectedOption, setSelectedOption] = React.useState(new Set(["Attack"]));
    const descriptionsMap = {
        Attack:
            "Record an .iq file to perform replay and jamming attacks.",
        Analyze:
            "Record all the necessary files for analysis (creates spectrogram & audio)",
        Both:
            "Get a complete capture recording all necessary files (.iq, audio2.json, .mp3, .wav)",
    };
    const labelsMap = {
        Attack: "Record an Attack Ready File",
        Analyze: "Record to Analyze",
        Both: "Attack & Analyze Simultaneously",
    }
    const selectedOptionValue = Array.from(selectedOption)[0];

    let tabs = [
        {
            id: "Receiver Options",
            label: "Receiver Options",
            content: (
                <div>
                    <div className="flex flex-col gap-3">

                        <div className="flex gap-3">
                            <Input
                                type="number"
                                step="0.1"
                                label="Frequency:"
                                placeholder={metadata?.frequency}
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                labelPlacement="outside"
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">MHz</span>
                                    </div>
                                }
                            />
                            <Select
                                label="Demodulator:"
                                labelPlacement="outside"
                                placeholder={demodulation}
                                onChange={(e) => setDemodulation(e.target.value)}
                                className="max-w-xs"
                                scrollShadowProps={{isEnabled: false,}}>
                                <SelectSection
                                    title="FM"
                                    classNames={{heading: "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small",}}>
                                    <SelectItem key="fm">FM</SelectItem>
                                    <SelectItem key="wfm">WFM</SelectItem>
                                    <SelectItem key="narrow_fm">Narrow FM</SelectItem>
                                    <SelectItem key="wfm_mono">WFM (mono)</SelectItem>
                                    <SelectItem key="wfm_stereo">WFM (stereo)</SelectItem>
                                    <SelectItem key="wfm_oirt">WFM (oirt)</SelectItem>
                                </SelectSection>
                                <SelectSection
                                    title="AM"
                                    classNames={{heading: "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small"}}>
                                    <SelectItem key="am">AM</SelectItem>
                                    <SelectItem key="am_sync">AM Sync</SelectItem>
                                </SelectSection>
                                <SelectSection
                                    title="OTHER"
                                    classNames={{heading: "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small"}}>
                                    <SelectItem key="lsb">LSB</SelectItem>
                                    <SelectItem key="usb">USB</SelectItem>
                                    <SelectItem key="cw_l">CW-L</SelectItem>
                                    <SelectItem key="cw_u">CW-U</SelectItem>
                                </SelectSection>
                                <SelectSection
                                    title="RAW/OFF"
                                    classNames={{heading: "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small"}}>
                                    <SelectItem key="raw">RAW I/Q</SelectItem>
                                    <SelectItem key="off">Demod OFF</SelectItem>
                                </SelectSection>
                            </Select>
                        </div>
                        <div className="flex gap-3">
                            <Input
                                type="number"
                                value={sampleRate}
                                onChange={(e) => setSampleRate(e.target.value)}
                                label="SampleRate"
                                placeholder={metadata?.sampleRate}
                                labelPlacement="outside"
                                endContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">Units</span>
                                    </div>
                                }
                            />
                            <Slider
                                label="Gain"
                                value={gain}
                                onChange={setGain}
                                showTooltip={true}
                                step={1}
                                maxValue={50}
                                minValue={0}
                                marks={[
                                    {
                                        value: 10,
                                        label: "10",
                                    },
                                    {
                                        value: 20,
                                        label: "20",
                                    },
                                    {
                                        value: 30,
                                        label: "30",
                                    },
                                    {
                                        value: 40,
                                        label: "40",
                                    },
                                ]}
                            />
                        </div>
                        <div className="flex gap-3">
                            <div className="text-default-500 text-medium">
                                <p>Filter Width:</p>
                                <Tabs color="primary" aria-label="Tabs colors" radius="full">
                                    <Tab key="Filter_width-wide" title="Wide"/>
                                    <Tab key="Filter_width-normal" title="Normal"/>
                                    <Tab key="Filter_width-narrow" title="Narrow"/>
                                    <Tab key="Filter_width-auto" title="Auto"/>
                                </Tabs>
                            </div>
                        </div>
                        <div className="flex gap-3">
                        </div>
                        <div className="flex gap-3">
                            <RadioGroup
                                label="Filter Shape:"
                                defaultValue="Filter-shape-soft"
                                orientation="horizontal"
                            >
                                <Radio value="Filter-shape-soft">Soft</Radio>
                                <Radio value="Filter-shape-normal">Normal</Radio>
                                <Radio value="Filter-shape-sharp">Sharp</Radio>
                            </RadioGroup>

                            <div className="flex gap-3 flex-col">
                                <Slider
                                    label="Squelch"
                                    color="warning"
                                    step={1}
                                    maxValue={100}
                                    minValue={-200}
                                    fillOffset={0}
                                    defaultValue={20}
                                    showTooltip={true}
                                    value={squeltch}
                                    onChange={setSqueltch}
                                    formatOptions={{signDisplay: 'always'}}
                                />

                                <RadioGroup
                                    label="AGG: "
                                    defaultValue="AGG-Medium"
                                    orientation="horizontal"
                                >
                                    <Radio value="AGG-Fast">Fast</Radio>
                                    <Radio value="AGG-Medium">Medium</Radio>
                                    <Radio value="AGG-Slow">Slow</Radio>
                                    <Radio value="AGG-Auto">Auto</Radio>
                                    <Radio value="AGG-Off">OFF</Radio>
                                </RadioGroup>
                            </div>
                        </div>
                        <Input
                            type="text"
                            label="Filename:"
                            placeholder={metadata?.name}
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            isRequired={fileName === "default"}
                            labelPlacement="outside"
                        />
                        <ButtonGroup isDisabled={fileName === "default"}
                                     color={`${isRecordingAdvanced ? 'danger' : 'primary'}`} fullWidth="true"
                                     onPress={isRecordingAdvanced ? handleStop : null}>
                            <Button
                                onPress={() => handleButtonSelection(selectedOptionValue)}>{labelsMap[selectedOptionValue]}</Button>
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <Button isIconOnly>
                                        <ChevronDownIcon/>
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Merge options"
                                    selectedKeys={selectedOption}
                                    selectionMode="single"
                                    onSelectionChange={setSelectedOption}
                                    className="max-w-[300px]"
                                >
                                    <DropdownItem key="Attack" description={descriptionsMap["Attack"]}>
                                        {labelsMap["Attack"]}
                                    </DropdownItem>
                                    <DropdownItem key="Analyze" description={descriptionsMap["Analyze"]}>
                                        {labelsMap["Analyze"]}
                                    </DropdownItem>
                                    <DropdownItem key="Both" description={descriptionsMap["Both"]}>
                                        {labelsMap["Both"]}
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </ButtonGroup>
                    </div>
                </div>
            )
        },
        {
            id: "Input Controls",
            label: "Reference Guide",
            content: (<div>

                <ReferenceGuide/>
            </div>)
        },
        {
            id: "FFT Settings",
            label: "TTP Guide",
            content: (<div>
                <Accordion variant="splitted">
                    <AccordionItem key="5" aria-label="Accordion 5" title="Frequency Hopping Interference">
                        Frequency Hopping Interference involves the intentional or unintentional disruption of wireless
                        communication systems that utilize frequency hopping spread spectrum (FHSS) technology. In FHSS,
                        the transmitter and receiver rapidly switch frequencies in a predetermined sequence to enhance
                        communication security and reduce interference. Interference can occur when an external signal
                        disrupts this frequency hopping pattern, leading to communication errors or failure. This
                        interference may result from other devices operating on the same frequency band or deliberate
                        attacks aimed at disrupting the communication.
                    </AccordionItem>
                    <AccordionItem key="3" aria-label="Accordion 1" title="Rolling Code Attacks">
                        Rolling code attacks target the security of remote keyless entry systems, like car key fobs.
                        These attacks involve intercepting and duplicating the rolling codes used to secure
                        communication between the device and receiver. By replicating the rolling code, attackers gain
                        unauthorized access to the targeted system, such as a car or garage.
                        <div style={{marginTop: '20px'}}>
                            <h2>How to Perform:</h2>
                            <ol>
                                <li>1) <b>Jam</b> the attacking frequency</li>
                                <li>2) <b>Intercept</b> at least two frequencies from the victim in order</li>
                                <li>3) <b>Replay</b> the most recent captured frequency (make sure to bypass Jam)</li>
                            </ol>
                        </div>
                    </AccordionItem>
                    <AccordionItem key="1" aria-label="Accordion 2" title="Replay Attacks">
                        A replay attack involves intercepting and retransmitting previously captured data to deceive a
                        system. Malicious actors record a legitimate data exchange and later replay it to trick the
                        system into accepting the duplicated data as genuine. This can occur in various contexts,
                        including authentication protocols, network communication, and cryptographic systems.
                    </AccordionItem>
                    <AccordionItem key="2" aria-label="Accordion 3" title="Jamming Attacks">
                        Jamming attacks involve intentionally disrupting wireless communication signals to hinder or
                        block the normal operation of a communication system. This is typically done by emitting
                        interfering signals, causing noise and rendering the targeted communication channel unusable.
                        amming attacks can be executed using various methods and technologies, such as radio frequency
                        (RF) jammers, which emit signals on the same frequency as the target communication system,
                        causing interference.
                        <b>NOTE THIS IS ILLEGAL IN MOST CASES</b>
                    </AccordionItem>
                    <AccordionItem key="4" aria-label="Accordion 4"
                                   title="RFID (Radio Frequency Identification) Skimming">
                        RFID skimming is a form of unauthorized data acquisition from RFID cards or tags. Attackers
                        wirelessly read and capture information stored on RFID-enabled cards, such as credit cards or
                        access cards, without physical contact.
                        Note that such an attack requires <b>physical proximity</b>.
                    </AccordionItem>
                </Accordion>
            </div>)
        }
    ];

    return (
        <Card
            className=" bg-default-50 rounded-xl shadow-md px-3 w-full py-5 px-4 lg:px-0  max-w-[90rem] mx-auto gap-3">
            <CardBody className="py-5 gap-4">
                <div className="flex gap-2.5 justify-center">
                    <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
                        <span className="text-default-900 text-xl font-semibold">
                            Radio Frequency Graph Options
                        </span>
                    </div>
                </div>
                <div className="flex w-full flex-col justify-center w-full max-w-[90rem]">
                    <Tabs aria-label="Dynamic tabs" items={tabs} color="primary" className="justify-center">
                        {(item) => (
                            <Tab key={item.id} title={item.label}>
                                <Card>
                                    <CardBody>
                                        {item.content}
                                    </CardBody>
                                </Card>
                            </Tab>
                        )}
                    </Tabs>
                </div>
            </CardBody>
        </Card>
    );
};