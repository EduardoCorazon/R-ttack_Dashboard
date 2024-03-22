// @ts-nocheck
"use client";
import systemIPConfig from "@/SystemIPConfig";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Tabs,
    Tab,
    Card,
    CardBody,
} from "@nextui-org/react";
import {useState, useRef, useEffect} from "react";
import SpectogramTwoD from "@/components/Spectogram/2DSpectogram";
import SpectogramThreeD from "@/components/Spectogram/3DSpectogram";
import {useSelector} from "react-redux";

const SpectogramCharts = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const metadata = useSelector((state) => state);
    const [selectedGraphType, setSelectedGraphType] = useState('2D');
    const currentMetadataName = metadata?.name || 'default';
    const [audio, setAudio] = useState(new Audio());

    useEffect(() => {
        const test = metadata?.name;
        setAudio(new Audio(`${systemIPConfig.ipAddress}/api/getAudioMP3/${currentMetadataName}`));
    }, [currentMetadataName]);

    const [isPlaying, setIsPlaying] = useState(false);

    const playAudio = () => {
        audio.play();
        setIsPlaying(true);
    };

    const stopAudio = () => {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
    };

    useEffect(() => {
        const handleAudioEnd = () => {
            setIsPlaying(false);
        };
        audio.addEventListener('ended', handleAudioEnd);
        return () => {
            audio.removeEventListener('ended', handleAudioEnd);
        };
    }, [audio]);

    const openFullscreenModal = (graphType) => {
        onOpen();
        onOpenChange({graphType});
        setSelectedGraphType(graphType);
    };

    return (
        <>
            <div style={{zIndex: "5000"}}>
                <Modal
                    backdrop="blur"
                    size="5xl"
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    motionProps={{
                        variants: {
                            enter: {
                                y: 0,
                                opacity: 1,
                                transition: {
                                    duration: 0.3,
                                    ease: "easeOut",
                                },
                            },
                            exit: {
                                y: -20,
                                opacity: 0,
                                transition: {
                                    duration: 0.2,
                                    ease: "easeIn",
                                },
                            },
                        }
                    }}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Radio Frequencies</ModalHeader>
                                <ModalBody>
                                    <div style={{height: "40vmin", width: "100%"}}>
                                        {/* Conditionally render SpectogramTwoD, SpectogramThreeD, or both based on selectedGraphType */}
                                        {selectedGraphType === '2D' ? (
                                            <SpectogramTwoD key={currentMetadataName}/>
                                        ) : selectedGraphType === '3D' ? (
                                            <SpectogramThreeD key={currentMetadataName}/>
                                        ) : (
                                            <>
                                                <div style={{height: "30%"}}>
                                                    <SpectogramTwoD key={currentMetadataName}/>
                                                </div>
                                                <div style={{height: "70%"}}>
                                                    <SpectogramThreeD key={currentMetadataName}/>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button color={isPlaying ? "danger" : "primary"}
                                            onClick={isPlaying ? stopAudio : playAudio}>
                                        {isPlaying ? "Stop Audio" : "Play Audio"}
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                <div className="flex w-full flex-col">
                    <Tabs aria-label="Options">
                        <Tab key="2D" title="2D Spectogram">
                            <Card>
                                <CardBody>
                                    <div style={{height: "30vmin"}}>
                                        <SpectogramTwoD key={currentMetadataName}/>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        paddingTop: "1vmin"
                                    }}>
                                        <div style={{margin: '20px'}}>
                                            <h1 style={{marginBottom: '20px'}}>
                                                The graph above shows a two-dimensional spectrogram for the analyzed
                                                captured frequency: <b>{metadata?.name}</b>
                                            </h1>
                                            <h2>Some things to look for:</h2>
                                            <ul style={{listStyleType: 'disc', marginLeft: '30px', lineHeight: '1.6'}}>
                                                <li>Any spikes in the graph</li>
                                                <li>Changes in Intensity (yellow indicates high intensity)</li>
                                                <li>Audible fuzzing/beeping spikes</li>
                                                <li>Distinct patterns or clusters</li>
                                                <li>Possible frequency shifts</li>
                                            </ul>
                                        </div>

                                        <div style={{margin: '20px'}}>
                                            <b>Generated Files:</b> .mp3 & .wav
                                        </div>

                                        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>
                                            <Button color={isPlaying ? "danger" : "primary"}
                                                    onClick={isPlaying ? stopAudio : playAudio}>
                                                {isPlaying ? "Stop Audio" : "Play Audio"}
                                            </Button>
                                            <Button onPress={() => openFullscreenModal('2D')} color="success"
                                                    style={{marginLeft: '10px'}}>Display
                                                in full screen</Button>
                                        </div>
                                    </div>


                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="3D" title="3D Spectogram">
                            <Card>
                                <CardBody>
                                    <div style={{height: "30vmin"}}>
                                        <SpectogramThreeD key={currentMetadataName}/>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        paddingTop: "1vmin"
                                    }}>
                                        <div style={{margin: '20px'}}>
                                            <h1 style={{marginBottom: '20px'}}>
                                                The graph above shows a three-dimensional spectrogram for the analyzed
                                                captured frequency: <b>{metadata?.name}</b>
                                            </h1>
                                            <h2>Some things to look for:</h2>
                                            <ul style={{listStyleType: 'disc', marginLeft: '30px', lineHeight: '1.6'}}>
                                                <li>Any spikes in the graph</li>
                                                <li>Changes in Intensity (yellow indicates high intensity)</li>
                                                <li>Audible fuzzing/beeping spikes</li>
                                                <li>Distinct patterns or clusters</li>
                                                <li>Possible frequency shifts</li>
                                            </ul>
                                        </div>

                                        <div style={{margin: '20px'}}>
                                            <b>Generated Files:</b> .mp3 & .wav
                                        </div>

                                        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>
                                            <Button color={isPlaying ? "danger" : "primary"}
                                                    onClick={isPlaying ? stopAudio : playAudio}>
                                                {isPlaying ? "Stop Audio" : "Play Audio"}
                                            </Button>
                                            <Button onPress={() => openFullscreenModal('3D')} color="success"
                                                    style={{marginLeft: '10px'}}>Display
                                                in full screen</Button>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Tab>
                        <Tab key="Info" title="Both 2D & 3D">
                            <Card>
                                <CardBody>
                                    <div style={{height: "80vmin"}}>
                                        <div style={{height: "30%"}}><SpectogramTwoD/></div>
                                        <div style={{height: "70%"}}><SpectogramThreeD/></div>
                                    </div>
                                    <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>
                                        <Button color={isPlaying ? "danger" : "primary"}
                                                onClick={isPlaying ? stopAudio : playAudio}>
                                            {isPlaying ? "Stop Audio" : "Play Audio"}
                                        </Button>
                                        <Button onPress={() => openFullscreenModal('Both')} color="success"
                                                style={{marginLeft: '10px'}}>Display
                                            in full screen</Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Tab>
                    </Tabs>
                </div>


            </div>
        </>
    );
};

export default SpectogramCharts;