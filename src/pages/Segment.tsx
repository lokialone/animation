import React, {useEffect, useRef, useState} from 'react';
import raf from 'raf';
import Segment from '../shape/segment';
import Slider from '../shape/slider';
import {walk} from '../utils/move';
interface Props {
    path?: string;
}

const SegmentsMove = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef?.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let cancelAnimationId = 0;
        const gravity = 0.01;
        let vx = 0.2;
        let vy = 0;
        const segment = new Segment(50, 15);
        const segment1 = new Segment(50, 10);
        const segment2 = new Segment(50, 15);
        const segment3 = new Segment(50, 10);
        segment.x = 200;
        segment.y = 200;
        segment2.x = 200;
        segment2.y = 200;
        const {x, y} = segment.getPin();
        segment1.x = x;
        segment1.y = y;
        let cycle = 0;
        function setVelocity() {
            vy += gravity;
            segment.x += vx;
            segment.y += vy;
            segment2.x += vx;
            segment2.y += vy;
        }

        function checkWalls() {
            const w = canvas.width + 200;
            if (segment.x > canvas.width + 100) {
                segment.x -= w;
                segment1.x -= w;
                segment2.x -= w;
                segment3.x -= w;
            } else if (segment.x < -100) {
                segment.x += w;
                segment1.x += w;
                segment2.x += w;
                segment3.x += w;
            }
        }

        function checkFloor(seg: Segment) {
            const y = seg.getPin().y + seg.height / 2;
            if (y > canvas.height) {
                const dy = y - canvas.height;
                segment.y -= dy;
                segment1.y -= dy;
                segment2.y -= dy;
                segment3.y -= dy;
                vx -= seg.vx;
                vy -= seg.vy;
            }
        }
        function drawFrame() {
            if (!ctx) return;
            cancelAnimationId = raf(drawFrame);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cycle += 0.02;
            setVelocity();
            walk(segment, segment1, cycle);
            walk(segment2, segment3, cycle + Math.PI);
            checkFloor(segment1);
            checkFloor(segment3);
            checkWalls();
            segment.draw(ctx);
            segment1.draw(ctx);
            segment2.draw(ctx);
            segment3.draw(ctx);
        }

        drawFrame();

        return () => {
            cancelAnimationFrame(cancelAnimationId);
        };
    }, []);

    return (
        <>
            <canvas ref={canvasRef} width={800} height={600} style={{background: '#000000'}}></canvas>
        </>
    );
};

export default SegmentsMove;
