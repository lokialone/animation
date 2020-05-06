import React, {useEffect, useRef, useState} from 'react';
import raf from 'raf';
import Ball from '../shape/ball';
import {checkCollision, checkBoundaries} from '../utils/move';
import {colorHexToRGB} from '../utils/index';
interface Props {
    path?: string;
}

const NodeGarden = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef?.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let cancelAnimationId = 0;
        const nodes: Ball[] = [];
        if (!ctx) return;

        function crateNodes() {
            const numbers = 60;
            for (let i = 0; i < numbers; i++) {
                const size = Math.random() * 0 + 2;
                const node = new Ball(size, '#ffffff');
                node.x = Math.random() * canvas.width;
                node.y = Math.random() * canvas.height;
                node.vx = Math.random() * 1 - 0.5;
                node.vy = Math.random() * 1 - 0.5;
                node.mass = size;
                nodes.push(node);
            }
        }
        function springBetween(from: Ball, target: Ball, minDist = 0, springAmount = 0.00005) {
            const dx = from.x - target.x;
            const dy = from.y - target.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist && ctx) {
                const alpha = 1 - dist / minDist;
                ctx.strokeStyle = colorHexToRGB('#ffffff', alpha);
                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(target.x, target.y);
                ctx.stroke();
                const ax = dx * springAmount;
                const ay = dy * springAmount;
                from.vx += ax / from.mass;
                from.vy += ay / from.mass;
                target.vx -= ax / target.mass;
                target.vy -= ay / target.mass;
            }
        }

        function move(node: Ball, i: number) {
            node.x += node.vx;
            node.y += node.vy;
            checkBoundaries(node, canvas);
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeA = nodes[j];
                checkCollision(node, nodeA);
                springBetween(node, nodeA, 100, 0.00005);
            }
        }

        function drawFrame() {
            if (!ctx) return;
            cancelAnimationId = raf(drawFrame);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            nodes.forEach(move);
            nodes.forEach(node => node.draw(ctx));
        }
        crateNodes();
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

export default NodeGarden;
