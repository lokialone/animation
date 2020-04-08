import React, {useEffect, useRef} from 'react';
import {captureMouse, parseColor} from '../utils/index';
import {fromEvent} from 'rxjs';
import {takeUntil, mergeMap, tap} from 'rxjs/operators';
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
        if (!ctx) return;
        const imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imagedata.data;
        const brushSize = 25;
        const brushDensity = 50;
        let brushColor = 0;
        const canvasDown$ = fromEvent(canvas, 'mousedown');
        const canvasMove$ = fromEvent(canvas, 'mousemove');
        const canvasUp$ = fromEvent(canvas, 'mouseup');
        function onMouseMove() {
            if (!ctx) return;
            //loop over each brush bristle
            for (let i = 0; i < brushDensity; i++) {
                const angle = Math.random() * Math.PI * 2,
                    radius = Math.random() * brushSize,
                    xpos = (mouse.x + Math.cos(angle) * radius) | 0,
                    ypos = (mouse.y + Math.sin(angle) * radius) | 0,
                    offset = (xpos + ypos * imagedata.width) * 4; //array index of canvas coordinate

                //set the color of a pixel using its component colors: r,g,b,a (0-255)
                pixels[offset] = (brushColor >> 16) & 0xff; //red
                pixels[offset + 1] = (brushColor >> 8) & 0xff; //green
                pixels[offset + 2] = brushColor & 0xff; //blue
                pixels[offset + 3] = 255; //alpha
            }

            ctx.putImageData(imagedata, 0, 0);
        }
        const sub = canvasDown$
            .pipe(
                tap(() => {
                    brushColor = Number(parseColor(Math.random() * 0xffffff, true));
                }),
                mergeMap(() => canvasMove$.pipe(takeUntil(canvasUp$))),
            )
            .subscribe(() => {
                onMouseMove();
            });
        return () => {
            sub.unsubscribe();
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
