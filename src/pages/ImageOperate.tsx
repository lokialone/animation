import React, {useEffect, useRef} from 'react';
import {fromEvent, Observable} from 'rxjs';
import styled from '@emotion/styled';
import {useImmer} from 'use-immer';
import {takeUntil, mergeMap, tap, map} from 'rxjs/operators';
import {convertPosition} from '../utils/index';
const Container = styled.div`
    position: relative;
`;
interface SelectDivProps {
    visible: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
}
const SelectDiv = styled.div<SelectDivProps>`
    width: ${props => props.width + 'px'};
    height: ${props => props.height + 'px'};
    position: absolute;
    background: transparent;
    border: 1px dashed black;
    display: ${props => (props.visible ? 'block' : 'none')};
    top: ${props => props.y + 'px'};
    left: ${props => props.x + 'px'};
`;

function imageAdjust(width: number, height: number, maxWidth: number, maxHeight: number) {
    // mode 分为cover, contain, fill, none, 暂进近包含
    let renderWidth = maxWidth;
    let renderHeight = maxHeight;
    const containerRatio = maxWidth / maxHeight;
    const imageRatio = width / height;
    if (imageRatio > containerRatio) {
        // 使用width
        renderWidth = maxWidth;
        renderHeight = maxWidth / imageRatio;
    } else if (imageRatio < containerRatio) {
        renderHeight = maxHeight;
        renderWidth = maxHeight * imageRatio;
    }
    return {width: renderWidth, height: renderHeight};
}
const ImageOperate = (props: {path: string}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectDivPorps, setSelectDivPorps] = useImmer<SelectDivProps>({
        visible: false,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const canvasMouseDown$ = fromEvent(canvas, 'mousedown');
        const canvasMouseMove$ = fromEvent(window, 'mousemove');
        const canvasMouseUp$ = fromEvent(window, 'mouseup');
        const loadImage$ = Observable.create(function observable(observer: any) {
            const image = new Image();
            image.src = '/01.jpeg';
            image.onload = function () {
                observer.next(image);
                console.log(image.width, image.height);
            };
        });
        let showImage: null | any = null;
        const drag$ = loadImage$
            .pipe(
                tap((image: any) => {
                    showImage = image;
                    ctx.drawImage(showImage, 0, 0);
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
                        tap(({startX, startY}) => {
                            setSelectDivPorps(draft => {
                                draft.visible = true;
                                draft.x = startX;
                                draft.y = startY;
                                draft.width = 0;
                                draft.height = 0;
                            });
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
                setSelectDivPorps(draft => {
                    draft.width = currnetX - startX;
                    draft.height = currentY - startY;
                });

                if (showImage) {
                    const {width, height} = imageAdjust(
                        currnetX - startX,
                        currentY - startY,
                        showImage.width,
                        showImage.height,
                    );
                    ctx.drawImage(
                        showImage,
                        startX,
                        startY,
                        currnetX - startX,
                        currentY - startY,
                        400,
                        0,
                        width,
                        height,
                    );
                }
            });

        return () => {
            drag$.unsubscribe();
        };
    }, []);
    return (
        <Container>
            <SelectDiv {...selectDivPorps}></SelectDiv>
            <canvas ref={canvasRef} width={800} height={600}></canvas>
            <div>放大鼠标选中的区域</div>
        </Container>
    );
};

export default ImageOperate;
