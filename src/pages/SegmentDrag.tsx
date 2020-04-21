import React, {useEffect, useRef, useState} from 'react';
import raf from 'raf';
import Segment from '../shape/segment';
import Ball from '../shape/ball';
import {captureMouse} from '../utils';
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
        const mouse = captureMouse(canvas);
        const segments: Segment[] = [];
        const ball = new Ball();
        const gravity = 0.5,
            bounce = -0.9;
        ball.vx = 10;
        let numSegments = 5;
        let reachTarget = mouse;
        while (numSegments--) {
            segments.push(new Segment(40, 10));
        }

        segments[4].x = canvas.width / 2;
        segments[4].y = canvas.height / 2;

        function moveBall() {
            ball.vy += gravity;
            ball.x += ball.vx;
            ball.y += ball.vy;
            if (ball.x + ball.radius > canvas.width) {
                ball.x = canvas.width - ball.radius;
                ball.vx *= bounce;
            } else if (ball.x - ball.radius < 0) {
                ball.x = ball.radius;
                ball.vx *= bounce;
            }
            if (ball.y + ball.radius > canvas.height) {
                ball.y = canvas.height - ball.radius;
                ball.vy *= bounce;
            } else if (ball.y - ball.radius < 0) {
                ball.y = ball.radius;
                ball.vy *= bounce;
            }
        }

        function checkHit() {
            const segment = segments[0],
                dx = segment.getPin().x - ball.x,
                dy = segment.getPin().y - ball.y,
                dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < ball.radius) {
                ball.vx += (Math.random() * 2 - 1) * 0.5;
                ball.vy -= 1;
            }
        }
        function reach(segment: Segment, xpos: number, ypos: number) {
            const dx = xpos - segment.x,
                dy = ypos - segment.y;
            segment.rotation = Math.atan2(dy, dx);
            const w = segment.getPin().x - segment.x,
                h = segment.getPin().y - segment.y;
            return {
                x: xpos - w,
                y: ypos - h,
            };
        }

        function position(segmentA: Segment, segmentB: Segment) {
            segmentA.x = segmentB.getPin().x;
            segmentA.y = segmentB.getPin().y;
        }

        function drag(from: Segment, targetX: number, targetY: number) {
            const dx = targetX - from.x,
                dy = targetY - from.y;
            from.rotation = Math.atan2(dy, dx);
            const w = from.getPin().x - from.x,
                h = from.getPin().y - from.y;
            from.x = targetX - w;
            from.y = targetY - h;
        }

        function move(segment: Segment, i: number) {
            if (i !== 0) {
                drag(segment, segments[i - 1].x, segments[i - 1].y);
            }
        }
        function reachMove(segment: Segment, i: number) {
            if (i !== 0) {
                reachTarget = reach(segment, reachTarget.x, reachTarget.y);
                position(segments[i - 1], segment);
            }
        }

        function drawFrame() {
            if (!ctx) return;
            cancelAnimationId = raf(drawFrame);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // drag(segments[0], mouse.x, mouse.y);
            // segments.forEach(move);
            // segments.forEach(segment => segment.draw(ctx));
            moveBall();
            reachTarget = reach(segments[0], ball.x, ball.y);
            segments.forEach(reachMove);
            segments.forEach(segment => segment.draw(ctx));
            checkHit();
            ball.draw(ctx);
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
