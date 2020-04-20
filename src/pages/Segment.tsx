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
        function drawFrame() {
            if (!ctx) return;
            cancelAnimationId = raf(drawFrame);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cycle += 0.02;
            walk(segment, segment1, cycle);
            walk(segment2, segment3, cycle + Math.PI);
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
