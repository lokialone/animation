import React, {useEffect, useRef, useState} from 'react';
import {fromEvent, Observable, Subject, Subscriber} from 'rxjs';
import {convertPosition} from '../../utils/index';
import {takeUntil, mergeMap, tap, map, mapTo} from 'rxjs/operators';
import Grid from '../../shape/grid';
import Rect from '../../shape/rect';
import Line from './line';
type ShapeClassType = Rect;
let inputingShape: ShapeClassType | null;
let currentShape: ShapeClassType | null;
const shapes: ShapeClassType[] = [];
let dragging: ShapeClassType | null;
let drawLineFlag = false;
let currentLine: any = null;

let draggingOffsetX: number;
let draggingOffsetY: number;
const _isEdit = false;
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
const CanvasArea = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
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

        canvasMouseMove$.subscribe((event: any) => {
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
            rect.stroke(context);
            context.restore();
        }
        function updateRubberband(x: number, y: number) {
            drawRubberbandShape(x, y);
        }
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
    return <canvas ref={canvasRef} width={800} height={600}></canvas>;
};

export default CanvasArea;
