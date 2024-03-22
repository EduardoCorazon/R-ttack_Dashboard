// @ts-nocheck
import systemIPConfig from "@/SystemIPConfig";
import React, {useEffect, useRef} from "react";
import {
    AxisScrollStrategies,
    AxisTickStrategies,
    emptyLine,
    lightningChart,
    LUT,
    PalettedFill,
    regularColorSteps
} from "@arction/lcjs";
import {licenseConfig} from "@/license";

const SpectogramThreeD = (props) => {
    const {id, data} = props;
    const containerRef = useRef(null);
    const chart3DRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const lc = lightningChart({
            license: licenseConfig.key,
            licenseInformation: licenseConfig.information,
        })

        const chart3D = lc.Chart3D({container}).setTitle('| 3D audio spectrogram |');
        const historyMs = 27 * 1000;
        const sampleRateHz = 35;
        const sampleIntervalMs = 1000 / sampleRateHz;
        let labelLoadingChart3D = chart3D.addUIElement().setText('Loading frequency data ...');

        fetch(`${systemIPConfig.ipAddress}/api/getAudio2Ch`)
            .then((r) => r.json())
            .then((data) => {
                labelLoadingChart3D.dispose();
                labelLoadingChart3D = undefined;

                const theme = chart3D.getTheme();
                const lut = new LUT({
                    steps: regularColorSteps(0, 255, theme.examples?.spectrogramColorPalette),
                    units: 'db',
                    interpolate: true,
                });

                const rowStep = 40;
                const intensityValueToDb = (value) => -100 + (value / 255) * (-30 - -100);
                const channel = {
                    name: 'Channel 1',
                    data: data.ch1,
                    columnIndex: 0,
                };
                const rows = channel.data[0].length;

                chart3D.getDefaultAxisX()
                    .setTickStrategy(AxisTickStrategies.Time)
                    .setScrollStrategy(AxisScrollStrategies.progressive)
                    .setInterval({start: -historyMs, end: 0, stopAxisAfter: false});
                chart3D.getDefaultAxisY()
                    .setTitle('Intensity (dB)')
                    .setTickStrategy(AxisTickStrategies.Numeric, (ticks) =>
                        ticks.setFormattingFunction((y) => intensityValueToDb(y).toFixed(0))
                    );
                chart3D.getDefaultAxisZ().setTitle('Frequency (Hz)');

                const SurfaceScrollingSeries3D = chart3D.addSurfaceScrollingGridSeries({
                    scrollDimension: 'columns',
                    columns: Math.ceil(historyMs / sampleIntervalMs),
                    rows,
                    step: {x: sampleIntervalMs, z: rowStep},
                })
                    .setFillStyle(new PalettedFill({lut, lookUpProperty: 'y'}))
                    .setWireframeStyle(emptyLine);

                let tStart = window.performance.now();
                let pushedDataCount = 0;

                const streamData = () => {
                    const tNow = window.performance.now();
                    const shouldBeDataPointsCount = Math.floor((sampleRateHz * (tNow - tStart)) / 1000);
                    const newDataPointsCount = Math.min(shouldBeDataPointsCount - pushedDataCount, 100);

                    if (newDataPointsCount > 0) {
                        const newDataPoints = [];
                        for (let iDp = 0; iDp < newDataPointsCount; iDp++) {
                            const iData = (pushedDataCount + iDp) % channel.data.length;
                            const sample = channel.data[iData];
                            newDataPoints.push(sample);
                        }

                        SurfaceScrollingSeries3D.addValues({yValues: newDataPoints});
                        pushedDataCount += newDataPointsCount;
                    }
                    requestAnimationFrame(streamData);
                };

                streamData();
                chart3DRef.current = {chart3D, SurfaceScrollingSeries3D};

                return () => {
                    if (chart3DRef.current) {
                        chart3DRef.current.chart3D.dispose();
                    }
                    chart3DRef.current = null;
                };

            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        const chart3DInstance = chart3DRef.current;
        if (chart3DInstance) {
            const {SurfaceScrollingSeries3D} = chart3DInstance;
            SurfaceScrollingSeries3D.addValues(data);
        }
    }, [data]);


    return (
        <div
            id={id}
            ref={containerRef}
            style={{width: "100%", height: "100%"}}
        ></div>
    );
};

export default SpectogramThreeD;