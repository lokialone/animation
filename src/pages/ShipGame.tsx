import React, {useEffect, useRef} from 'react';
import {fromEvent} from 'rxjs';
import {map, filter, tap} from 'rxjs/operators';
import raf from 'raf';
import Ship from '../shape/ship';
interface Props {
    path?: string;
}
interface Directions {
    ax: number;
    ay: number;
}
const DragDraw = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef?.current) return;
        const canvas = canvasRef?.current;
        const ctx = canvas.getContext('2d');
        const ship = new Ship();
        if (!ctx) return;
        const canvasKeyDown$ = fromEvent(window, 'keydown');
        const canvasKeyUp$ = fromEvent(window, 'keyup');
        ship.x = 100;
        ship.y = 200;
        ship.draw(ctx);
        let cancelAnimationId = 0;
        let vr = 0;
        let vx = 0;
        let vy = 0;
        // const f = 0.01;
        let thrust = 0;
        canvasKeyDown$.subscribe((val: any) => {
            switch (val.key) {
                case 'ArrowLeft':
                    vr = -3;
                    break;
                case 'ArrowRight':
                    vr = 3;
                    break;
                case 'ArrowUp':
                    thrust = 0.05;
                    ship.showFlame = true;
                    break;
                default:
                    break;
            }
        });

        canvasKeyUp$.subscribe(() => {
            thrust = 0;
            vr = 0;
            ship.showFlame = false;
        });
        function draw() {
            if (!ctx) return;
            cancelAnimationId = raf(draw);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ship.rotation += (vr * Math.PI) / 180;

            // if (thrust > 0) {
            //     thrust -= f;
            // } else {
            //     thrust += f;
            // }
            const angle = ship.rotation;
            const ax = Math.cos(angle) * thrust;
            const ay = Math.sin(angle) * thrust;
            vx += ax;
            vy += ay;

            ship.x += vx;
            ship.y += vy;
            ship.draw(ctx);
        }
        draw();

        return () => {
            cancelAnimationFrame(cancelAnimationId);
        };
    });
    return (
        <div style={{position: 'relative'}}>
            <div>键盘左右控制方向, 上表示前进</div>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                style={{border: '1px solid yellow', background: '#000000'}}></canvas>
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
