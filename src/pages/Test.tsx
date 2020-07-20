import React, {useEffect, useRef, useState, useCallback} from 'react';
import {useImmer} from 'use-immer';
import {captureMouse} from '../utils/index';
interface Props {
    path?: string;
}

let mouse: any;
const Test = (props: Props) => {
    /** Search info action */
    const canvasRef = useRef<HTMLCanvasElement>(null);
    function almostEqual(x: number, y: number, diff = 1) {
        if (Math.abs(x - y) < diff) return true;
        return false;
    }
    function drawLines(
        ctx: CanvasRenderingContext2D,
        fromX: number,
        fromY: number,
        toX: number,
        toY: number,
        directionX: number,
        directionY: number,
    ) {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        if (almostEqual(fromX, toX) || almostEqual(fromY, toY)) {
            //drawLine

            ctx.lineTo(toX, toY);
            ctx.stroke();
            ctx.closePath();
            return;
        }
        //draw
        if (directionY === 1) {
            const toControlX = toX;
            const toControlY = toY - (fromY - toY) * 0.4;
            const fromControlX = fromX;
            const fromControlY = (toY - fromY) * 0.5 + fromY;
            ctx.bezierCurveTo(fromControlX, fromControlY, toControlX, toControlY, toX, toY);
            ctx.stroke();
        }
    }
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            mouse = captureMouse(canvas);
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            const beginX = 200;
            const beginY = 0;
            const endX = 0;
            const endY = 200;
            drawLines(ctx, beginX, beginY, endX, endY, 0, 1);
        }
    }, []);
    return (
        <div>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default Test;
