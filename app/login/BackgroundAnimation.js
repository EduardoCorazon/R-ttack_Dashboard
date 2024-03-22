"use client";

import React, {useEffect, useRef} from "react";
import * as THREE from 'three';

const BackgroundAnimation = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = canvas.parentElement;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({canvas, alpha: true});

        renderer.setSize(container.clientWidth, container.clientHeight);
        camera.position.z = 5;

        // create cube with black edges
        const createCube = () => {
            const cubeSize = 1; // Adjust the size of the cubes
            const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const textColor = 'rgb(236, 237, 238)'; // set the color of the cubes

            // Convert the text color to a hexadecimal value
            const hexColor = new THREE.Color(textColor).getHex();
            const material = new THREE.LineBasicMaterial({color: hexColor, linewidth: 2});

            const edges = new THREE.EdgesGeometry(geometry);
            const cube = new THREE.LineSegments(edges, material);

            cube.position.x = (Math.random() - 0.5) * 10; //adjust to space them out more
            cube.position.y = (Math.random() - 0.5) * 10;
            cube.position.z = (Math.random() - 0.5) * 10;
            cube.rotation.x = Math.random() * Math.PI;
            cube.rotation.y = Math.random() * Math.PI;

            scene.add(cube);
            return cube;
        };

        const cubes = [];
        const numberOfCubes = 7; // Adjust the number of cubes
        for (let i = 0; i < numberOfCubes; i++) {
            cubes.push(createCube());
        }

        const animate = () => {
            requestAnimationFrame(animate);

            cubes.forEach((cube) => {
                cube.rotation.x += 0.0010; // Adjust rotation speed
                cube.rotation.y += 0.0010; // Adjust rotation speed
                cube.position.z = Math.sin(cube.rotation.x * 0.02) * 5; // Adjust the movement range
            });

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} style={{position: 'absolute', top: 0, left: 0, zIndex: 0}}/>;
};

export default BackgroundAnimation;