import React, {useEffect, useRef, useState} from 'react';
import raf from 'raf';
import Ball from '../shape/ball';
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
        const ball = new Ball();
        let xpos = 0,
            ypos = 0,
            zpos = 0,
            vx = Math.random() * 10 - 5,
            vy = Math.random() * 10 - 5,
            vz = Math.random() * 10 - 5;
        const fl = 250,
            vpX = canvas.width / 2,
            vpY = canvas.height / 2,
            top = -100,
            bottom = 100,
            left = -100,
            right = 100,
            back = 100,
            front = -100;

        function drawFrame() {
            if (!ctx) return;
            cancelAnimationId = raf(drawFrame);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            xpos += vx;
            ypos += vy;
            zpos += vz;

            if (xpos + ball.radius > right) {
                xpos = right - ball.radius;
                vx *= -1;
            } else if (xpos - ball.radius < left) {
                xpos = left + ball.radius;
                vx *= -1;
            }
            if (ypos + ball.radius > bottom) {
                ypos = bottom - ball.radius;
                vy *= -1;
            } else if (ypos - ball.radius < top) {
                ypos = top + ball.radius;
                vy *= -1;
            }
            if (zpos + ball.radius > back) {
                zpos = back - ball.radius;
                vz *= -1;
            } else if (zpos - ball.radius < front) {
                zpos = front + ball.radius;
                vz *= -1;
            }
            if (zpos > -fl) {
                const scale = fl / (fl + zpos);
                ball.scaleX = ball.scaleY = scale;
                ball.x = vpX + xpos * scale;
                ball.y = vpY + ypos * scale;
                ball.visible = true;
            } else {
                ball.visible = false;
            }
            if (ball.visible) {
                ball.draw(ctx);
            }
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
