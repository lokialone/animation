import React, {useState, useRef, useEffect} from 'react';
import raf from 'raf';
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
