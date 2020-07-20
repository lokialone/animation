import React, {useEffect, useRef} from 'react';
import raf from 'raf';
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
        if (!ctx) return;
        image.src = '/01.jpeg';

        function inverColor(ctx: CanvasRenderingContext2D): void {
            const imagedata = ctx.getImageData(0, 0, image.width, image.height);
            const pixels = imagedata.data;
            for (let i = 0; i < 16; i += 1) {
                for (let j = 0; j < 16; j += 1) {
                    const index = i * image.width + j * image.height;
                    pixels[index] = 255 - pixels[index]; //red to cyan
                    pixels[index + 1] = 255 - pixels[index + 1]; //green to magenta
                    pixels[index + 2] = 255 - pixels[index + 2];

                    // needDraw = !needDraw;
                }
            }
            ctx.putImageData(imagedata, 0, 0);
        }
        image.onload = () => {
            ctx.drawImage(image, 0, 0);
            inverColor(ctx);
            // grayScale(ctx);
        };
    }, []);
    return (
        <>
            <canvas ref={canvasRef} width={800} height={600}></canvas>
        </>
    );
};

export default Home;
