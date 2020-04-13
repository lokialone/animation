import React, {useEffect, useRef, useState} from 'react';
import raf from 'raf';
import Ball from '../shape/ball';
import {Subject, fromEvent, Observable} from 'rxjs';
import {filter, mergeMap, takeUntil, map, tap} from 'rxjs/operators';
import {convertPosition, containPoint, captureMouse, getDirect, getDistance} from '../utils';
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
        let cancelAnimationId = 0;
        const mouse = captureMouse(canvas);
        const ball0 = new Ball(20);
        const ball1 = new Ball(20);
        ball0.x = Math.random() * canvas.width;
        ball0.y = Math.random() * canvas.height;
        ball1.x = Math.random() * canvas.width;
        ball1.y = Math.random() * canvas.height;
        let ball0Draging = false;
        let ball1Draging = false;
        const spring = 0.03;
        const friction = 0.95;
        const springLength = 50;
        canvas.addEventListener('mousedown', () => {
            if (containPoint(ball1.getBounds(), mouse.x, mouse.y)) {
                ball1Draging = true;
            }
            if (containPoint(ball0.getBounds(), mouse.x, mouse.y)) {
                ball0Draging = true;
            }
        });
        window.addEventListener('mouseup', () => {
            if (ball1Draging || ball0Draging) {
                ball0Draging = false;
                ball1Draging = false;
            }
        });
        canvas.addEventListener('mousemove', () => {
            if (ball0Draging) {
                ball0.x = mouse.x;
                ball0.y = mouse.y;
            }
            if (ball1Draging) {
                ball1.x = mouse.x;
                ball1.y = mouse.y;
            }
        });
        function springTo(ballA: Ball, ballB: Ball) {
            const dx = ballB.x - ballA.x;
            const dy = ballB.y - ballA.y;
            const angle = Math.atan2(dy, dx);
            const targetX = ballB.x - Math.cos(angle) * springLength;
            const targetY = ballB.y - Math.sin(angle) * springLength;
            ballA.vx += (targetX - ballA.x) * spring;
            ballA.vy += (targetY - ballA.y) * spring;
            ballA.vx *= friction;
            ballA.vy *= friction;
            ballA.x += ballA.vx;
            ballA.y += ballA.vy;
        }
        function drawFrame() {
            if (!ctx) return;
            cancelAnimationId = raf(drawFrame);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (ball1Draging) {
                springTo(ball0, ball1);
            }
            if (ball0Draging) {
                springTo(ball1, ball0);
            }
            ctx.beginPath();
            ctx.moveTo(ball0.x, ball0.y);
            ctx.lineTo(ball1.x, ball1.y);
            ctx.stroke();
            ctx.closePath();
            ball0.draw(ctx);
            ball1.draw(ctx);
        }
        drawFrame();

        return () => {
            cancelAnimationFrame(cancelAnimationId);
        };
    }, []);

    return (
        <>
            <div>小球可拖拽</div>
            <canvas ref={canvasRef} width={800} height={600}></canvas>
        </>
    );
};

export default BallMoveContainer;
