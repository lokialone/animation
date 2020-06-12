import Rect from '@shape/rect';
import Grid from '@shape/grid';
import {fromEvent, Observable, Subject, Subscriber, Subscription} from 'rxjs';
import {convertPosition} from '@utils/index';
import {takeUntil, mergeMap, tap, map, mapTo} from 'rxjs/operators';
interface DraggingInfo {
    isDragging?: boolean;
    target?: Rect;
    offsetX?: number;
    offsetY?: number;
    startX?: number;
    startY?: number;
}
export enum ModeType {
    Edit,
    Create,
}
export default class Stage {
    ctx: CanvasRenderingContext2D;
    shapes: Rect[];
    mode: ModeType;
    draggingInfo: DraggingInfo;
    draggingTarget?: Rect;
    width: number;
    height: number;
    drag$: Subscription;
    savedSurface?: ImageData;
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.shapes = [];
        this.mode = ModeType.Create;
        this.draggingInfo = {isDragging: false};
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this._drawGrid();
        const {drag$} = this.initListener();
        this.drag$ = drag$;
    }
    saveDrawIngSurface() {
        this.savedSurface = this.ctx.getImageData(0, 0, this.width, this.height);
    }
    restoreDrawingSurface() {
        if (this.savedSurface) this.ctx.putImageData(this.savedSurface, 0, 0);
    }

    _recordDraggingInfo({startX, startY, offsetX, offsetY, target, isDragging}: DraggingInfo) {
        this.saveDrawIngSurface();
        if (startX) this.draggingInfo.startX = startX;
        if (startY) this.draggingInfo.startY = startY;
        if (offsetX) this.draggingInfo.offsetX = offsetX;
        if (offsetY) this.draggingInfo.offsetY = offsetY;
        if (target) this.draggingInfo.target = target;
        if (isDragging) this.draggingInfo.isDragging = isDragging;
    }
    initListener() {
        const canvas = this.ctx.canvas;
        const canvasMouseDown$ = fromEvent(canvas, 'mousedown');
        const doubleClick$ = fromEvent(canvas, 'dblclick');
        const windowMouseMove$ = fromEvent(window, 'mousemove');
        const windowMouseUp$ = fromEvent(window, 'mouseup');
        const canvasMouseMove$ = fromEvent(canvas, 'mousemove');
        // canvasMouseMove$.subscribe((event: any) => {
        //     const {x, y} = convertPosition(event as MouseEvent, canvas);
        //     this.shapes.forEach((sp: Rect) => {
        //         sp.createPath(this.ctx);
        //         if (this.ctx.isPointInPath(x, y)) {
        //             sp.setHoverState(true);
        //         } else {
        //             sp.setHoverState(false);
        //         }
        //     });
        //     this.refresh();
        // });
        const drag$ = canvasMouseDown$
            .pipe(
                tap(event => {
                    const {x, y} = convertPosition(event as MouseEvent, canvas);
                    if (this.mode === ModeType.Edit) {
                        const sp = this.getSeletedShape(x, y);
                        if (sp) {
                            this._recordDraggingInfo({
                                startX: x,
                                startY: y,
                                offsetX: sp.x - x,
                                offsetY: sp.y - y,
                                target: sp,
                                isDragging: true,
                            });
                        }
                    } else {
                        this._recordDraggingInfo({startX: x, startY: y, isDragging: false});
                    }
                }),
                mergeMap(() =>
                    windowMouseMove$.pipe(
                        takeUntil(
                            windowMouseUp$.pipe(
                                tap(event => {
                                    if (this.mode === ModeType.Create) {
                                        if (this.draggingTarget) this.shapes.push(this.draggingTarget);
                                    }
                                    this._recordDraggingInfo({isDragging: false});
                                    this.draggingTarget = undefined;
                                }),
                            ),
                        ),
                    ),
                ),
            )
            .subscribe(event => {
                const {x, y} = convertPosition(event as MouseEvent, canvas);

                if (this.mode === ModeType.Create) {
                    this.restoreDrawingSurface();
                    this._drawRubberband(x, y);
                } else if (this.mode === ModeType.Edit && this.draggingInfo.isDragging) {
                    const sp = this.draggingInfo.target;
                    if (sp) {
                        sp.x = x + (this.draggingInfo.offsetX || 0);
                        sp.y = y + (this.draggingInfo.offsetY || 0);
                        this.refresh();
                    }
                }
            });
        return {drag$};
    }
    _drawRubberband(x: number, y: number) {
        const startX = this.draggingInfo.startX || 0;
        const startY = this.draggingInfo.startY || 0;
        const width = Math.abs(x - startX);
        const height = Math.abs(y - startY);
        const left = x > startX ? startX : x;
        const top = y > startY ? startY : y;
        const ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = 'black';
        const rect = new Rect({
            x: left,
            y: top,
            width: width,
            height: height,
        });
        this.draggingTarget = rect;
        rect.stroke(ctx);
        ctx.restore();
    }
    getSeletedShape(x: number, y: number) {
        const length = this.shapes.length;
        for (let i = 0; i < length; i++) {
            const sp = this.shapes[i];
            sp.createPath(this.ctx);
            if (this.ctx.isPointInPath(x, y)) {
                return sp;
            }
        }
    }
    add(shape: Rect) {
        this.shapes.push(shape);
    }
    setMode(mode: ModeType) {
        this.mode = mode;
    }
    reset() {
        this.clearCanvas();
        this._drawGrid();
        this.shapes = [];
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    refresh() {
        this.clearCanvas();
        this._drawGrid();
        this._drawShapes();
    }
    _drawGrid() {
        const grid = new Grid(0, 0, 10, 10, this.width, this.height);
        grid.draw(this.ctx);
    }
    _drawShapes() {
        this.shapes.forEach((sh: Rect) => sh.stroke(this.ctx));
    }
    destroy() {
        this.shapes = [];
        this.drag$.unsubscribe();
        this.clearCanvas();
    }
}
