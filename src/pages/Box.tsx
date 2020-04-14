import React, {useEffect, useRef, useState} from 'react';
import raf from 'raf';
import Box from '../shape/box';
import colors from 'nice-color-palettes';
import {convertPosition, containPoint, captureMouse, intersects} from '../utils';
interface Props {
    path?: string;
}

const BallMoveContainer = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef?.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const boxes: Box[] = [];

        function createBox() {
            const box = new Box(
                Math.random() * 40 + 10,
                Math.random() * 40 + 10,
                colors[0][Math.ceil(Math.random() * 5)],
            );
            box.x = Math.random() * canvas.width;
            boxes.push(box);
            return box;
        }
        let activeBox = createBox();

        function drawBox(box: Box) {
            if (!ctx) return;
            if (activeBox !== box && intersects(activeBox, box)) {
                activeBox.y = box.y - activeBox.height;
                activeBox = createBox();
            }
            box.draw(ctx);
        }
        let cancelAnimationId = 0;
        const gravity = 0.4;

        function draw() {
            if (!ctx) return;
            cancelAnimationId = raf(draw);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            activeBox.vy += gravity;
            activeBox.y += activeBox.vy;
            if (activeBox.y + activeBox.height > canvas.height) {
                activeBox.y = canvas.height - activeBox.height;
                activeBox = createBox();
            }
            boxes.forEach(drawBox);
        }
        draw();

        return () => {
            cancelAnimationFrame(cancelAnimationId);
        };
    }, []);

    return (
        <>
            <canvas ref={canvasRef} width={800} height={600}></canvas>
        </>
    );
};

export default BallMoveContainer;
