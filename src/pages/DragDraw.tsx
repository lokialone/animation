import React, {useEffect, useRef} from 'react';
import {captureMouse, convertPosition} from '../utils/index';
import {fromEvent} from 'rxjs';
import {takeUntil, mergeMap, map} from 'rxjs/operators';
// import raf from 'raf';
interface Props {
    path?: string;
}
const DragDraw = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef?.current) return;
        const ctx = canvasRef && canvasRef?.current.getContext('2d');
        const canvas = canvasRef?.current;
        if (!ctx) return;
        const canvasMouseMove = fromEvent(canvas, 'mousemove');
        const canvasMouseUp = fromEvent(document, 'mouseup');
        const canvasMouseDown = fromEvent(canvas, 'mousedown');
        const canvasTouchMove = fromEvent(canvas, 'touchmove');
        const canvasTouchEnd = fromEvent(document, 'touchend');
        const canvasTouchStart = fromEvent(canvas, 'touchstart');
        let colorHue = 0;
        function init(): void {
            if (!ctx) return;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.lineWidth = 70;
        }
        init();
        function painit(x: number, y: number): void {
            if (!ctx) return;
            ctx.strokeStyle = `hsl(${colorHue}, 100%, 60%)`;
            ctx.beginPath();
            ctx.lineTo(x, y);
            ctx.stroke();
            colorHue++;
        }

        canvasTouchStart
            .pipe(
                mergeMap(() => {
                    return canvasTouchMove.pipe(
                        map((event: any) => {
                            return convertPosition(event, canvas, true);
                        }),
                        takeUntil(canvasTouchEnd),
                    );
                }),
            )
            .subscribe(({x, y}) => {
                painit(x, y);
            });

        canvasMouseDown
            .pipe(
                mergeMap(() => {
                    return canvasMouseMove.pipe(
                        map((event: any) => {
                            return convertPosition(event, canvas, false);
                        }),
                        takeUntil(canvasMouseUp),
                    );
                }),
            )
            .subscribe(({x, y}) => {
                painit(x, y);
            });
    }, []);
    return (
        <div style={{position: 'relative'}}>
            <canvas ref={canvasRef} width={800} height={650} style={{border: '1px solid yellow'}}></canvas>
            <div
                style={{
                    position: 'absolute',
                    top: '30%',
                    left: '30%',
                    userSelect: 'none',
                }}>
                Drag and move0.0
            </div>
        </div>
    );
};

export default DragDraw;
