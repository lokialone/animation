import React, {useState, useRef, useEffect} from 'react';
import raf from 'raf';
import {Particle, Effect} from './basic/Particle';
interface Props {
    path?: string;
}

const PariicleImage = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef?.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const effect = new Effect(ctx);
        function render() {
            ctx!.clearRect(0, 0, canvas.width, canvas.height);
            effect.update();
            effect.draw();
            raf(render);
        }
        render();

        // return () => {};
    }, []);

    return (
        <>
            <div>
                <button> repaint </button>
                <button> print </button>
            </div>
            鼠标移动到图片触发效果
            <canvas ref={canvasRef} width={800} height={600}></canvas>
        </>
    );
};

export default PariicleImage;
