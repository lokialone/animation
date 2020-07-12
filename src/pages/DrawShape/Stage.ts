import Rect from '@shape/rect';
import Grid from '@shape/grid';
import {fromEvent, Observable, Subject, Subscriber, Subscription} from 'rxjs';
import {convertPosition} from '@utils/index';
import {takeUntil, mergeMap, tap, debounceTime, map, mapTo} from 'rxjs/operators';
import Line from './line';
export enum ModeType {
    Edit,
    Create,
}
export default class Stage {
    ctx: CanvasRenderingContext2D;
    shapes: Rect[];
    edges: Line[];
    mode: ModeType;
    width: number;
    height: number;
    savedSurface?: ImageData;
    drag$?: Subscription | null;
    create$?: Subscription | null;
    hover$: Subscription;
    input$?: Subscription | null;
    isDraggingLine?: boolean;
    currentLine?: Line;
    canvasMouseDown$: Observable<Event>;
    windowMouseMove$: Observable<Event>;
    windowMouseUp$: Observable<Event>;
    canvasMouseMove$: Observable<Event>;
    canvasdblclick$: Observable<Event>;
    inputCallback: Function[];
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.shapes = [];
        this.mode = ModeType.Create;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this._drawGrid();
        const canvas = this.ctx.canvas;
        this.canvasMouseDown$ = fromEvent(canvas, 'mousedown');
        this.windowMouseMove$ = fromEvent(window, 'mousemove');
        this.windowMouseUp$ = fromEvent(window, 'mouseup');
        this.canvasMouseMove$ = fromEvent(canvas, 'mousemove');
        this.canvasdblclick$ = fromEvent(canvas, 'dblclick');
        const {create$} = this.initModeListener(ModeType.Create);
        this.hover$ = this.initHoverListener();
        this.create$ = create$;
        this.edges = [];
        this.inputCallback = [];
    }

    handleDoubleClick(fn: Function) {
        if (typeof fn === 'function') {
            this.inputCallback.push(fn);
        }
    }
    saveDrawIngSurface() {
        this.savedSurface = this.ctx.getImageData(0, 0, this.width, this.height);
    }
    restoreDrawingSurface() {
        if (this.savedSurface) this.ctx.putImageData(this.savedSurface, 0, 0);
    }

    initHoverListener() {
        // const hoverStateCache = new WeakMap();
        const hover$ = this.canvasMouseMove$.subscribe((event: any) => {
            if (this.mode !== ModeType.Edit) return;
            const {x, y} = convertPosition(event as MouseEvent, this.ctx.canvas);
            // let currentHoverState: Rect;
            this.shapes.forEach((sp: Rect) => {
                const {isIntersecting} = sp.isIntersecting(this.ctx, x, y);
                if (isIntersecting) {
                    sp.setHoverState(true);
                } else {
                    sp.setHoverState(false);
                }
            });
            // if ()
            this.refresh();
        });
        return hover$;
    }
    // 绘制mode下的创建绘制元素
    createCreateModeListener() {
        let mouseDownX = 0;
        let mouseDownY = 0;
        let draggingTarget: Rect | undefined;
        const _drawRubberband = (x: number, y: number) => {
            const startX = mouseDownX || 0;
            const startY = mouseDownY || 0;
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
            draggingTarget = rect;
            rect.stroke(ctx);
            ctx.restore();
        };
        const create$ = this.canvasMouseDown$
            .pipe(
                tap(event => {
                    const {x, y} = convertPosition(event as MouseEvent, this.ctx.canvas);
                    this.saveDrawIngSurface();
                    mouseDownX = x;
                    mouseDownY = y;
                }),
                mergeMap(() =>
                    this.windowMouseMove$.pipe(
                        takeUntil(
                            this.windowMouseUp$.pipe(
                                tap(() => {
                                    if (draggingTarget) this.shapes.push(draggingTarget);
                                    draggingTarget = undefined;
                                }),
                            ),
                        ),
                    ),
                ),
            )
            .subscribe(event => {
                const {x, y} = convertPosition(event as MouseEvent, this.ctx.canvas);
                this.restoreDrawingSurface();
                _drawRubberband(x, y);
            });
        return create$;
    }

    createEditModeListener() {
        let offsetX = 0;
        let offsetY = 0;
        let target: Rect | undefined;
        let line: Line;
        let drawLine = false;
        const drag$ = this.canvasMouseDown$
            .pipe(
                tap(event => {
                    const {x, y} = convertPosition(event as MouseEvent, this.ctx.canvas);
                    const {shape, isInAchor, anchorIndex, isInBody} = this.getSeletedShape(x, y);

                    if (shape && isInBody) {
                        target = shape;
                        this.saveDrawIngSurface();
                        offsetX = shape.x - x;
                        offsetY = shape.y - y;
                    } else if (shape && isInAchor) {
                        drawLine = true;
                        target = shape;
                        this.saveDrawIngSurface();
                        line = new Line(shape, anchorIndex || 0);
                    }
                }),
                mergeMap(() =>
                    this.windowMouseMove$.pipe(
                        takeUntil(
                            this.windowMouseUp$.pipe(
                                tap(event => {
                                    const {x, y} = convertPosition(event as MouseEvent, this.ctx.canvas);
                                    const {shape, isInAchor, anchorIndex} = this.getSeletedShape(x, y);
                                    if (shape && isInAchor) {
                                        line.setDestination({to: shape, anchorIndex: anchorIndex || 0});
                                        this.edges.push(line);
                                    }
                                    target = undefined;
                                    drawLine = false;
                                }),
                            ),
                        ),
                    ),
                ),
            )
            .subscribe(event => {
                const {x, y} = convertPosition(event as MouseEvent, this.ctx.canvas);
                if (target && !drawLine) {
                    target.x = x + offsetX;
                    target.y = y + offsetY;
                    this.refresh();
                } else if (drawLine) {
                    line.drawTo(this.ctx, x, y);
                }
            });
        const input$ = this.canvasdblclick$.subscribe(event => {
            const {x, y} = convertPosition(event as MouseEvent, this.ctx.canvas);
            this.shapes.some((sp: Rect) => {
                const {isInBody} = sp.isIntersecting(this.ctx, x, y);
                if (isInBody) {
                    this.inputCallback.forEach(fn => fn(sp));
                    return true;
                }
            });
        });
        return {drag$, input$};
    }
    initModeListener(mode: ModeType) {
        let create$ = null;
        let edit$ = null;
        if (mode === ModeType.Create) {
            create$ = this.createCreateModeListener();
        } else {
            edit$ = this.createEditModeListener();
        }
        return {create$, edit$};
    }

    getSeletedShape(x: number, y: number) {
        const length = this.shapes.length;
        for (let i = 0; i < length; i++) {
            const sp = this.shapes[i];
            const {isInBody, isInAchor, anchorIndex} = sp.isIntersecting(this.ctx, x, y);
            if (isInAchor) {
                return {
                    shape: sp,
                    isInAchor: isInAchor,
                    isInBody,
                    anchorIndex,
                };
            }
            if (isInBody) {
                return {
                    shape: sp,
                    isInBody,
                    isInAchor,
                    anchorIndex,
                };
            }
        }
        return {shape: null};
    }
    add(shape: Rect) {
        this.shapes.push(shape);
    }
    setMode(mode: ModeType) {
        if (mode !== this.mode) {
            this.mode = mode;
            if (this.drag$) {
                this.drag$.unsubscribe();
                this.drag$ = undefined;
            }
            if (this.create$) {
                this.create$.unsubscribe();
                this.create$ = null;
            }
            if (this.input$) {
                this.input$.unsubscribe();
                this.input$ = undefined;
            }
            const {edit$, create$} = this.initModeListener(mode);
            this.drag$ = (edit$ && edit$.drag$) || null;
            this.input$ = (edit$ && edit$.input$) || null;
            this.create$ = create$;
        }
    }
    reset() {
        this.clearCanvas();
        this._drawGrid();
        this.shapes = [];
        this.edges = [];
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    refresh() {
        this.clearCanvas();
        this._drawGrid();
        this._drawShapes();
        this._dragEdges();
    }
    _drawGrid() {
        const grid = new Grid(0, 0, 10, 10, this.width, this.height);
        grid.draw(this.ctx);
    }
    _drawShapes() {
        this.shapes.forEach((sh: Rect) => sh.stroke(this.ctx));
    }

    _dragEdges() {
        this.edges.forEach((sh: Line) => sh.draw(this.ctx));
    }

    destroy() {
        this.shapes = [];
        this.clearCanvas();
        if (this.drag$) this.drag$.unsubscribe();
        if (this.create$) this.create$.unsubscribe();
        this.hover$.unsubscribe();
    }
}
