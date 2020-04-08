import React, {useEffect, useRef} from 'react';
import {captureMouse} from '../utils/index';
import {fromEvent} from 'rxjs';
import {takeUntil, mergeMap} from 'rxjs/operators';
import raf from 'raf';
interface Props {
    path?: string;
}
const DragDraw = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef?.current) return;
        const canvas = canvasRef?.current;
        const ctx = canvas.getContext('2d');
        const mouse = captureMouse(canvas);
        let cancelAnimationId = 0;
        function draw() {
            if (!ctx) return;
            cancelAnimationId = raf(draw);

            //draw some stripes: red, green, and blue
            for (let i = 0; i < canvas.width; i += 10) {
                for (let j = 0; j < canvas.height; j += 10) {
                    ctx.fillStyle = i % 20 === 0 ? '#f00' : i % 30 === 0 ? '#0f0' : '#00f';
                    ctx.fillRect(i, j, 10, 10);
                }
            }

            const imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height),
                pixels = imagedata.data;

            //pixel iteration
            for (let y = 0; y < imagedata.height; y += 1) {
                for (let x = 0; x < imagedata.width; x += 1) {
                    const dx = x - mouse.x,
                        dy = y - mouse.y,
                        dist = Math.sqrt(dx * dx + dy * dy),
                        offset = (x + y * imagedata.width) * 4,
                        r = pixels[offset],
                        g = pixels[offset + 1],
                        b = pixels[offset + 2];

                    pixels[offset] = Math.cos(r * dist * 0.001) * 256;
                    pixels[offset + 1] = Math.sin(g * dist * 0.001) * 256;
                    pixels[offset + 2] = Math.cos(b * dist * 0.0005) * 256;
                }
            }

            ctx.putImageData(imagedata, 0, 0);
        }
        draw();
        return () => {
            cancelAnimationFrame(cancelAnimationId);
        };
    });
    return (
        <div style={{position: 'relative'}}>
            <canvas ref={canvasRef} width={800} height={650} style={{border: '1px solid yellow'}}></canvas>
            {/* <div
                style={{
                    position: 'absolute',
                    top: '30%',
                    left: '30%',
                    userSelect: 'none',
                }}>
                
            </div> */}
        </div>
    );
};

export default DragDraw;
