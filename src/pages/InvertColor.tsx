import React, {useEffect, useRef} from 'react';
// import Arrow from '../shape/arrow';
import {captureMouse} from '../utils/index';
import raf from 'raf';
// import {fromEvent} from 'rxjs';
interface Props {
    path?: string;
}
const Home = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef?.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const image = new Image();
        const mouse = captureMouse(canvas);
        if (!ctx) return;
        image.src = '/logo192.png';

        function inverColor(ctx: CanvasRenderingContext2D): void {
            const imagedata = ctx.getImageData(0, 0, image.width, image.height);
            const pixels = imagedata.data;
            for (let i = 0, len = pixels.length; i < len; i += 4) {
                pixels[i] = 255 - pixels[i]; //red to cyan
                pixels[i + 1] = 255 - pixels[i + 1]; //green to magenta
                pixels[i + 2] = 255 - pixels[i + 2]; //blue to yellow
            }
            ctx.putImageData(imagedata, 200, 0);
        }
        function grayScale(ctx: CanvasRenderingContext2D): void {
            const imagedata = ctx.getImageData(0, 0, image.width, image.height);
            const pixels = imagedata.data;
            for (let i = 0, len = pixels.length; i < len; i += 4) {
                const red = pixels[i];
                const green = pixels[i + 1];
                const blue = pixels[i + 2];
                const y = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
                pixels[i] = pixels[i + 1] = pixels[i + 2] = y;
            }
            ctx.putImageData(imagedata, 0, 200);
        }
        image.onload = () => {
            ctx.drawImage(image, 0, 0);
            inverColor(ctx);
            grayScale(ctx);
        };
    }, []);
    return (
        <>
            <canvas ref={canvasRef} width={800} height={600}></canvas>
        </>
    );
};

export default Home;
