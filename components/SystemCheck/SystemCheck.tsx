// @ts-nocheck
import systemIPConfig from '@/SystemIPConfig';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Spinner} from "@nextui-org/react";
import {
    Card,
    CardHeader,
    CardBody,
    Divider,
    Link,
    Image,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure
} from "@nextui-org/react";

const SystemCheck = () => {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);

    const fetchData = async (url, setStatus) => {
        try {
            setStatus({loading: true, message: '', error: false});
            const response = await axios.get(url);
            const data = response.data;
            setStatus({loading: false, message: data.message, error: false});
        } catch (error) {
            const errorMessage =
                error.response?.status === 500
                    ? error.response?.data?.error || 'Internal server error'
                    : error.message || 'Error checking system requirements';
            setStatus({loading: false, message: errorMessage, error: true});
        }
    };

    // Define checks
    const [rtlSdrStatus, setrtlSdrStatus] = useState({loading: true, message: '', error: false});
    const [soxStatus, setSoxStatus] = useState({loading: true, message: '', error: false});
    const [ffmpegStatus, setFfmpegStatus] = useState({loading: true, message: '', error: false});
    const [lcjsStatus, setLcjsStatus] = useState({loading: true, message: '', error: false});

    useEffect(() => {
        setLoading(true);
        fetchData(`${systemIPConfig.ipAddress}/api/SystemCheck/rtl_sdr`, setrtlSdrStatus);
        fetchData(`${systemIPConfig.ipAddress}/api/SystemCheck/sox`, setSoxStatus);
        fetchData(`${systemIPConfig.ipAddress}/api/SystemCheck/ffmpeg`, setFfmpegStatus);
        fetchData(`${systemIPConfig.ipAddress}/api/SystemCheck/lightningchart`, setLcjsStatus);
    }, []);

    const handleRefresh = () => {
        setLoading(true);
        console.log("refreshing")
        fetchData(`${systemIPConfig.ipAddress}/api/SystemCheck/rtl_sdr`, setrtlSdrStatus);
        fetchData(`${systemIPConfig.ipAddress}/api/SystemCheck/sox`, setSoxStatus);
        fetchData(`${systemIPConfig.ipAddress}/api/SystemCheck/ffmpeg`, setFfmpegStatus);
        fetchData(`${systemIPConfig.ipAddress}/api/SystemCheck/lightningchart`, setLcjsStatus);
    };

    const renderStatus = (loading, message, error, successMessage) => {
        if (loading) {
            return (
                <div className="flex items-left gap-2 py-2">
                    <Spinner label={message} color="primary" style={{flexDirection: 'row'}}/>
                    <>Checking System Requirements</>
                </div>
            );
        } else {
            return (
                <>
                    <div className="flex items-center gap-2 py-2">
                        <Image
                            src={error ? '/error-image.png' : '/checkmark-image.png'}
                            alt={error ? 'Error' : 'Success'}
                            width={35}
                            height={35}
                        />
                        {error ? <p>{message}</p> : <p>{successMessage}</p>}
                    </div>
                </>
            );
        }
    };

    const renderRtlSdrStatus = () => {
        const {loading, message, error} = rtlSdrStatus;
        return renderStatus(loading, message, error, 'Rlt-sdr drivers are successfully installed');
    };
    const renderSoxStatus = () => {
        const {loading, message, error} = soxStatus;
        return renderStatus(loading, message, error, 'sox is successfully installed');
    };
    const renderFfmpegStatus = () => {
        const {loading, message, error} = ffmpegStatus;
        return renderStatus(loading, message, error, 'ffmpeg is successfully installed');
    };
    const renderLcjsStatus = () => {
        const {loading, message, error} = lcjsStatus;
        return renderStatus(loading, message, error, 'LightningChartJS is Activated');
    };

    return (
        <>
            <Link href="#" onPress={onOpen} >Check System</Link>
            <Modal
                backdrop="opaque"
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
                            <ModalHeader className="flex flex-col gap-1">Checking system requirements</ModalHeader>
                            <ModalBody>
                                <div className="flex items-center justify-center  ">
                                    <Card className="max-w-[400px]">
                                        <CardHeader className="flex gap-3">
                                            <div className="flex flex-col">
                                                <p className="text-md">Checking system requirements</p>
                                                <p className="text-small text-default-500">For more information, please
                                                    refer to documentation at: </p>
                                            </div>
                                        </CardHeader>
                                        <Divider/>
                                        <CardBody>
                                            <div>
                                                {renderRtlSdrStatus()}
                                                {renderSoxStatus()}
                                                {renderFfmpegStatus()}
                                                {renderLcjsStatus()}
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={handleRefresh}>
                                    Refresh
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};
export default SystemCheck;