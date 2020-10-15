import React, {useEffect, useRef} from 'react';
import raf from 'raf';
import SpriteFrame from './Sprite';

const Sprite = (props: {path: string}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasRef?.current) return;
        const canvas = canvasRef.current;
        const image = new Image();
        image.src = '/fish.png';
        image.onload = function () {
            console.log(image.width, image.height);
            const spriteFrame = new SpriteFrame(canvas, {
                sprite: image,
                loop: true,
                numberOfFrames: 12,
                ticksPerFrame: 12
            });
            function drawFrame() {
                spriteFrame.render();
                spriteFrame.update();
                raf(drawFrame)
            }
            drawFrame();
        };
        
    }, []);
    return (<>
        <canvas ref={canvasRef} width={800} height={600}></canvas>
    </>)
};

export default Sprite;