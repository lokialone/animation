import React, {useEffect, useRef} from 'react';
import {fromEvent, Observable, Subscriber} from 'rxjs';
import styled from '@emotion/styled';
import {useImmer} from 'use-immer';
import {takeUntil, mergeMap, tap, map} from 'rxjs/operators';
import {convertPosition} from '../utils/index';
import {Position2d} from '../types';
const Container = styled.div`
    position: relative;
`;
function rectsplit(n: number, a: Position2d, b: Position2d, c: Position2d, d: Position2d) {
    // ad 向量方向 n 等分
    const adX = (d.x - a.x) / n;
    const adY = (d.y - a.y) / n;
    // bc 向量方向 n 等分
    const bcX = (c.x - b.x) / n;
    const bcY = (c.y - b.y) / n;

    const ndots = [];
    let x1, y1, x2, y2, abX, abY;

    //左边点递增，右边点递增，获取每一次递增后的新的向量，继续 n 等分，从而获取所有点坐标
    for (let i = 0; i <= n; i++) {
        //获得 ad 向量 n 等分后的坐标
        x1 = a.x + adX * i;
        y1 = a.y + adY * i;
        //获得 bc 向量 n 等分后的坐标
        x2 = b.x + bcX * i;
        y2 = b.y + bcY * i;

        for (let j = 0; j <= n; j++) {
            // ab 向量为：[x2 - x1 , y2 - y1]，所以 n 等分后的增量为除于 n
            abX = (x2 - x1) / n;
            abY = (y2 - y1) / n;

            ndots.push({
                x: x1 + abX * j,
                y: y1 + abY * j,
            });
        }
    }

    return ndots;
}

function loadImage(url: string) {
    return Observable.create(function observable(observer: any) {
        const image = new Image();
        image.src = url;
        image.onload = function () {
            observer.next(image);
        };
    });
}
const ImageTransform = (props: {path: string}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const canvasMouseDown$ = fromEvent(canvas, 'mousedown');
        const canvasMouseMove$ = fromEvent(window, 'mousemove');
        const canvasMouseUp$ = fromEvent(window, 'mouseup');
        const loadImage$ = loadImage('/01.jpeg');
        let showImage: null | any = null;
        const drag$ = loadImage$
            .pipe(
                tap(image => {
                    showImage = image;
                }),
                mergeMap(() =>
                    canvasMouseDown$.pipe(
                        tap(() => {
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(showImage, 0, 0);
                        }),
                        map((event: any) => {
                            const {x, y} = convertPosition(event, canvas);
                            return {startX: x, startY: y};
                        }),
                        mergeMap(({startX, startY}) =>
                            canvasMouseMove$.pipe(
                                map((event: any) => ({startX, startY, event})),
                                takeUntil(canvasMouseUp$),
                            ),
                        ),
                    ),
                ),
            )
            .subscribe((result: any) => {
                ctx.clearRect(400, 0, showImage.width, showImage.height);
                const {startX, startY, event} = result;
                const {x: currnetX, y: currentY} = convertPosition(event, canvas);
            });

        return () => {
            drag$.unsubscribe();
        };
    }, []);
    return (
        <Container>
            <canvas ref={canvasRef} width={800} height={600}></canvas>
            <div>放大鼠标选中的区域</div>
        </Container>
    );
};

export default ImageTransform;
