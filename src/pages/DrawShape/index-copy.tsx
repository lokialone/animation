import React, {useEffect, useRef, useState} from 'react';
import {fromEvent, Observable, Subject, Subscriber} from 'rxjs';
import styled from '@emotion/styled';
import {css} from '@emotion/core';
import {takeUntil, mergeMap, tap, map, mapTo} from 'rxjs/operators';
import Grid from '../../shape/grid';
import {convertPosition} from '@utils/index';
import Rect from '../../shape/rect';
import Line from './line';
import {useImmer} from 'use-immer';
interface SimpleButtonProps {
    isActive?: boolean;
}

interface TextInputInfo {
    value: string;
    show: boolean;
    x: number;
    y: number;
}

const TextInput = styled.input`
    position: absolute;
    left: ${(props: TextInputInfo) => props.x + 'px'};
    top: ${(props: TextInputInfo) => props.y + 'px'};
`;
const SimpleButton = styled.button`
    border-radius: 4px;
    display: inline-block;
    color: #31445b;
    background: white;
    border: 1px solid #31445b;
    padding: 4px 8px;
    font-size: 12px;
    ${(props: SimpleButtonProps) =>
        props.isActive &&
        css`
            background: #31445b;
            color: white;
        `}
    margin: 8px;
    text-align: center;
`;
const Container = styled.div`
    position: relative;
    height: 100vh;
    cursor: pointer;
`;
type ShapeClassType = Rect;
const ease$ = new Subject<React.MouseEvent<any>>();
const edit$ = new Subject<React.MouseEvent<any>>();
const create$ = new Subject<React.MouseEvent<any>>();
let inputingShape: ShapeClassType | null;
let currentShape: ShapeClassType | null;
const shapes: ShapeClassType[] = [];
let dragging: ShapeClassType | null;
let drawLineFlag = false;
let currentLine: any = null;

let draggingOffsetX: number;
let draggingOffsetY: number;
let _isEdit = false;
let ctx: CanvasRenderingContext2D;
const relationShips: Line[] = [];
function drawAllShapes(ctx: CanvasRenderingContext2D) {
    relationShips.forEach((line: Line) => line.draw(ctx));
    shapes.forEach((sh: ShapeClassType) => sh.stroke(ctx));
}
function resetCanvas() {
    if (!ctx) return;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    ctx.clearRect(0, 0, width, height);
    const grid = new Grid(0, 0, 10, 10, width, height);
    grid.draw(ctx);
    drawAllShapes(ctx);
}

const DrawShape = (props: {path: string}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [textInputInfo, setTextInputInfo] = useImmer<TextInputInfo>({value: '', show: false, x: 0, y: 0});
    const textInputOnChange = (e: any) => {
        const value = e.target && e.target.value;
        setTextInputInfo(draft => {
            draft.value = value;
        });
    };
    const textInputOnKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            if (isEdit && inputingShape) inputingShape.setContent(textInputInfo.value);
            setTextInputInfo(draft => {
                draft.show = false;
                draft.value = '';
            });
            resetCanvas();
        }
    };
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;
        ctx = context;

        let drawingSurface: ImageData;
        const mouseDown = {x: 0, y: 0};
        const rubberbandRect = {width: 0, height: 0, left: 0, top: 0};
        const canvasMouseDown$ = fromEvent(canvas, 'mousedown');
        const doubleClick$ = fromEvent(canvas, 'dblclick');
        const windowMouseMove$ = fromEvent(window, 'mousemove');
        const windowMouseUp$ = fromEvent(window, 'mouseup');
        const canvasMouseMove$ = fromEvent(canvas, 'mousemove');
        const grid = new Grid(0, 0, 10, 10, canvas.width, canvas.height);
        grid.draw(context);
        edit$.subscribe(() => {
            _isEdit = true;
            setEdit(true);
        });
        create$.subscribe(() => {
            _isEdit = false;
            setEdit(false);
        });

        canvasMouseMove$.subscribe((event: any) => {
            if (!_isEdit || dragging) return;
            const {x, y} = convertPosition(event as MouseEvent, canvas);
            shapes.forEach((sp: ShapeClassType) => {
                sp.createPath(context);
                if (context.isPointInPath(x, y)) {
                    sp.setHoverState(true);
                } else {
                    sp.setHoverState(false);
                }
            });
            resetCanvas();
        });

        doubleClick$.subscribe((event: any) => {
            if (!_isEdit) return;
            const {x, y} = convertPosition(event as MouseEvent, canvas);
            shapes.some((sp: ShapeClassType) => {
                sp.createPath(context);
                if (context.isPointInPath(x, y)) {
                    inputingShape = sp;
                    return true;
                }
            });
            setTextInputInfo(draft => {
                if (inputingShape) {
                    draft.value = inputingShape.value || '';
                    draft.x = inputingShape.x + 10;
                    draft.y = inputingShape.y + inputingShape.height / 2 - 10;
                    draft.show = true;
                } else {
                    draft.show = false;
                }
            });
        });
        function saveDrawIngSurface() {
            if (!context || !canvas) return;
            drawingSurface = context.getImageData(0, 0, canvas.width, canvas.height);
        }
        function restoreDrawingSurface() {
            if (!context || !canvas) return;
            context.putImageData(drawingSurface, 0, 0);
        }

        function drawRubberbandShape(x: number, y: number) {
            rubberbandRect.width = Math.abs(x - mouseDown.x);
            rubberbandRect.height = Math.abs(y - mouseDown.y);
            if (x > mouseDown.x) rubberbandRect.left = mouseDown.x;
            else rubberbandRect.left = x;

            if (y > mouseDown.y) rubberbandRect.top = mouseDown.y;
            else rubberbandRect.top = y;
            if (!context) return;
            context.save();
            context.strokeStyle = 'black';
            const rect = new Rect({
                x: rubberbandRect.left,
                y: rubberbandRect.top,
                width: rubberbandRect.width,
                height: rubberbandRect.height,
            });
            currentShape = rect;
            rect.stroke(context);
            context.restore();
        }
        function updateRubberband(x: number, y: number) {
            drawRubberbandShape(x, y);
        }
        ease$.subscribe(() => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            shapes.length = 0;
            grid.draw(context);
            saveDrawIngSurface();
        });
        function startDragging(x: number, y: number) {
            saveDrawIngSurface();
            mouseDown.x = x;
            mouseDown.y = y;
        }

        function drawLine(context: CanvasRenderingContext2D, x: number, y: number, sp: Rect) {
            ctx.beginPath();
            ctx.moveTo(mouseDown.x, mouseDown.y);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.closePath();
            currentLine = new Line(sp, undefined, x, y);
            currentLine.draw(context);
        }

        const drag$ = canvasMouseDown$
            .pipe(
                tap(event => {
                    const {x, y} = convertPosition(event as MouseEvent, canvas);
                    drawLineFlag = false;
                    if (_isEdit) {
                        shapes.some((sp: ShapeClassType) => {
                            sp.createPath(context);
                            if (context.isPointInPath(x, y)) {
                                startDragging(x, y);
                                const anchors = sp.getAnchors();
                                const inAnchor = anchors.some(anchor => {
                                    const {x: arx, y: ary, r} = anchor;
                                    if (x > arx - r && x < arx + r && y < ary + r) {
                                        return true;
                                    }
                                });
                                if (!inAnchor) {
                                    dragging = sp;
                                    draggingOffsetX = x - sp.x;
                                    draggingOffsetY = y - sp.y;
                                } else {
                                    drawLineFlag = true;
                                    drawLine(context, x, y, sp);
                                }

                                return true;
                            }
                        });
                    } else {
                        startDragging(x, y);
                    }
                }),
                mergeMap(() =>
                    windowMouseMove$.pipe(
                        takeUntil(
                            windowMouseUp$.pipe(
                                tap(event => {
                                    if (_isEdit) {
                                        dragging = null;
                                    } else {
                                        if (currentShape) shapes.push(currentShape);
                                    }
                                    if (drawLineFlag) {
                                        const {x, y} = convertPosition(event as MouseEvent, canvas);
                                        currentLine.setDestination({x, y});
                                        relationShips.push(currentLine);
                                        currentLine = null;
                                        drawLineFlag = false;
                                        resetCanvas();
                                    }
                                }),
                            ),
                        ),
                    ),
                ),
            )
            .subscribe(event => {
                const {x, y} = convertPosition(event as MouseEvent, canvas);
                if (_isEdit) {
                    if (dragging) {
                        dragging.x = x - draggingOffsetX;
                        dragging.y = y - draggingOffsetY;
                        resetCanvas();
                    } else if (drawLineFlag) {
                        currentLine.drawTo(context, x, y);
                    }
                } else {
                    restoreDrawingSurface();
                    updateRubberband(x, y);
                }
            });
        return () => {
            drag$.unsubscribe();
        };
    }, []);
    return (
        <Container>
            <div id="controls">
                <div>
                    <SimpleButton onClick={e => edit$.next(e)} isActive={isEdit === true}>
                        编辑
                    </SimpleButton>
                    <SimpleButton onClick={e => create$.next(e)} isActive={isEdit === false}>
                        创建
                    </SimpleButton>
                    <SimpleButton onClick={e => ease$.next(e)} isActive={false}>
                        清除
                    </SimpleButton>
                    <span style={{fontSize: '12px'}}>编辑时 1.双击可输入文字 2.可拖拽</span>
                </div>
                <div></div>
                <div style={{position: 'relative', display: 'flex'}}>
                    <div style={{position: 'relative'}}>
                        {textInputInfo.show && (
                            <TextInput
                                type="text"
                                {...textInputInfo}
                                onChange={textInputOnChange}
                                onKeyPress={textInputOnKeyPress}
                            />
                        )}
                        <canvas ref={canvasRef} width={800} height={600}></canvas>
                    </div>
                    <div>样式编辑区 当前选中节点</div>
                </div>
            </div>
        </Container>
    );
};

export default DrawShape;
