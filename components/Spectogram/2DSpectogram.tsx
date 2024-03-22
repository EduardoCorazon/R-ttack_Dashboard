// @ts-nocheck
import systemIPConfig from "@/SystemIPConfig";
"use client";
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

const SpectogramTwoD = (props) => {
    const {id, data} = props;
    const containerRef = useRef(null);
    const chart2DRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }

        const lc = lightningChart({
            license: licenseConfig.key,
            licenseInformation: licenseConfig.information,
        })

        const chart2D = lc.ChartXY({container}).setTitle('| 2D audio spectrogram |');
        const historyMs = 27 * 1000;
        const sampleRateHz = 35;
        const sampleIntervalMs = 1000 / sampleRateHz;
        let labelLoadingChart2D = chart2D.addUIElement().setText('Loading frequency data ...');

        fetch(`${systemIPConfig.ipAddress}/api/getAudio2Ch`)
            .then((r) => r.json())
            .then((data) => {
                labelLoadingChart2D.dispose();
                labelLoadingChart2D = undefined;

                const theme = chart2D.getTheme();
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

                chart2D.getDefaultAxisX()
                    .setTickStrategy(AxisTickStrategies.Time)
                    .setScrollStrategy(AxisScrollStrategies.progressive)
                    .setInterval({start: -historyMs, end: 0, stopAxisAfter: false});
                chart2D.getDefaultAxisY().setTitle('Frequency (Hz)');

                const HeatmapScrollingSeries2D = chart2D.addHeatmapScrollingGridSeries({
                    scrollDimension: 'columns',
                    resolution: rows,
                    step: {x: sampleIntervalMs, y: rowStep},
                }).setFillStyle(new PalettedFill({lut}))
                    .setWireframeStyle(emptyLine)
                    .setDataCleaning({maxDataPointCount: 10000});

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

                        HeatmapScrollingSeries2D.addIntensityValues(newDataPoints);
                        pushedDataCount += newDataPointsCount;
                    }
                    requestAnimationFrame(streamData);
                };

                streamData();
                chart2DRef.current = {chart2D, HeatmapScrollingSeries2D};

                return () => {
                    if (chart2DRef.current) {
                        chart2DRef.current.chart2D.dispose();
                    }
                    chart2DRef.current = null;
                };

            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        const chart2DInstance = chart2DRef.current;
        if (chart2DInstance) {
            const {HeatmapScrollingSeries2D} = chart2DInstance;
            HeatmapScrollingSeries2D.addIntensityValues(data);

        }
    }, [data]);

    return (
        <div
            id={id}
            ref={containerRef}
            style={{width: "100%", height: "100%",}}
        ></div>
    );
};

export default SpectogramTwoD;