import React, {useEffect, useRef, useState} from 'react';
import {fromEvent, Observable, Subject, Subscriber} from 'rxjs';
import styled from '@emotion/styled';
import {css} from '@emotion/core';
import {takeUntil, mergeMap, tap, map, mapTo} from 'rxjs/operators';
import Grid from '../../shape/grid';
import {convertPosition} from '../../utils/index';
import Box from '../../shape/box';
import Circle from '../../shape/circle';
import drawGuideLines from '../../shape/guideline';
import Polygon from '../../shape/ploygon';
interface SimpleButtonProps {
    isActive?: boolean;
}
const SimpleButton = styled.div`
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
enum ShapeType {
    Rect = 'Rect',
    Circle = 'Circle',
    Polygon = 'Polygon',
    // Line = 'Line',
    // Text = 'Text',
}
type shapesMap = {
    [index in ShapeType]: ShapeClassType[];
};
interface ShapeOption {
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    sides?: number;
}
type ShapeClassType = Box | Polygon | Circle;
const ease$ = new Subject<React.MouseEvent<any>>();
const edit$ = new Subject<React.MouseEvent<any>>();
const create$ = new Subject<React.MouseEvent<any>>();

const DrawShape = (props: {path: string}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // const [shape, setShape] = useState<ShapeType>(ShapeType.Rect);
    const shapeType = useRef<ShapeType>(ShapeType.Rect);
    const [isEdit, setEdit] = useState<boolean>(false);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;
        const grid = new Grid(0, 0, 10, 10, canvas.width, canvas.height);
        grid.draw(context);
        let drawingSurface: ImageData;
        const mouseDown = {x: 0, y: 0};
        const rubberbandRect = {width: 0, height: 0, left: 0, top: 0};
        const canvasMouseMove$ = fromEvent(canvas, 'mousemove');
        const canvasMouseDown$ = fromEvent(canvas, 'mousedown');
        const doubleClick$ = fromEvent(canvas, 'click');
        const windowMouseMove$ = fromEvent(window, 'mousemove');
        const windowMouseUp$ = fromEvent(window, 'mouseup');
        let currentShape: ShapeClassType | null;
        const shapes: ShapeClassType[] = [];
        let dragging: ShapeClassType | null;
        let draggingOffsetX: number;
        let draggingOffsetY: number;
        let _isEdit = false;
        edit$.subscribe(() => {
            _isEdit = true;
            setEdit(true);
        });
        create$.subscribe(() => {
            _isEdit = false;
            setEdit(false);
        });
        canvasMouseDown$.subscribe(() => {
            // if (is)
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
            // drawPolygon
            // if (!context) return;
            // let angle, radius;
            // if (mouseDown.y === y) {
            //     radius = Math.abs(x - mouseDown.x);
            // } else {
            //     angle = Math.atan(rubberbandRect.height / rubberbandRect.width);
            //     radius = rubberbandRect.height / Math.sin(angle);
            // }
            // context.beginPath();
            // const _shape = new Box({x: mouseDown.x, y: mouseDown.y, width: radius, height: radius});
            // _shape.stroke(context);
            // currentShape = _shape;
            rubberbandRect.width = Math.abs(x - mouseDown.x);
            rubberbandRect.height = Math.abs(y - mouseDown.y);

            if (x > mouseDown.x) rubberbandRect.left = mouseDown.x;
            else rubberbandRect.left = x;

            if (y > mouseDown.y) rubberbandRect.top = mouseDown.y;
            else rubberbandRect.top = y;
            if (!context) return;
            context.save();
            context.strokeStyle = 'black';
            if (shapeType.current === ShapeType.Rect) {
                const box = new Box({
                    x: rubberbandRect.left,
                    y: rubberbandRect.top,
                    width: rubberbandRect.width,
                    height: rubberbandRect.height,
                });
                currentShape = box;
                box.stroke(context);
            }
            if (shapeType.current === ShapeType.Circle) {
                const circle = new Circle({
                    x: rubberbandRect.left,
                    y: rubberbandRect.top,
                    radius: rubberbandRect.width,
                });
                currentShape = circle;
                circle.stroke(context);
            }
            context.restore();
        }

        function updateRubberbandRectangle(x: number, y: number) {
            rubberbandRect.width = Math.abs(x - mouseDown.x);
            rubberbandRect.height = Math.abs(y - mouseDown.y);

            if (x > mouseDown.x) rubberbandRect.left = mouseDown.x;
            else rubberbandRect.left = x;

            if (y > mouseDown.y) rubberbandRect.top = mouseDown.y;
            else rubberbandRect.top = y;
            if (!context) return;
            context.save();
            const box = new Box({
                x: rubberbandRect.left,
                y: rubberbandRect.top,
                width: rubberbandRect.width,
                height: rubberbandRect.height,
            });
            context.strokeStyle = 'red';
            box.stroke(context);

            context.restore();
        }
        function updateRubberband(x: number, y: number) {
            // updateRubberbandRectangle(x, y);
            drawRubberbandShape(x, y);
        }
        function drawAllShapes() {
            if (!context) return;
            shapes.forEach(shape => {
                shape.stroke(context);
            });
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

        canvasMouseDown$
            .pipe(
                tap(event => {
                    const {x, y} = convertPosition(event as MouseEvent, canvas);
                    if (_isEdit) {
                        shapes.some((sp: ShapeClassType) => {
                            sp.createPath(context);
                            if (context.isPointInPath(x, y)) {
                                startDragging(x, y);
                                dragging = sp;
                                draggingOffsetX = x - sp.x;
                                draggingOffsetY = y - sp.y;
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
                    }

                    context.clearRect(0, 0, canvas.width, canvas.height);
                    grid.draw(context);
                    drawAllShapes();
                } else {
                    restoreDrawingSurface();
                    updateRubberband(x, y);
                }
                // drawGuideLines(context, x, y);
            });
        return () => {
            // canvasDrawGideLines.unsubscribe();
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
                </div>
                <div>
                    <SimpleButton
                        onClick={e => {
                            shapeType.current = ShapeType.Circle;
                        }}>
                        圆
                    </SimpleButton>
                    <SimpleButton
                        onClick={e => {
                            shapeType.current = ShapeType.Rect;
                        }}>
                        矩形
                    </SimpleButton>
                    {/* <button
                        onClick={e => {
                            shape.current = ShapeType.Line;
                        }}>
                        直线todo
                    </button> */}
                    {/* <button
                        onClick={e => {
                            shapeType.current = ShapeType.Polygon;
                        }}>
                        多边形
                    </button> */}
                    {/* <button
                        onClick={e => {
                            shape.current = ShapeType.Text;
                        }}>
                        文字todo
                    </button> */}
                </div>
                <canvas ref={canvasRef} width={800} height={600}></canvas>
            </div>
        </Container>
    );
};

export default DrawShape;
