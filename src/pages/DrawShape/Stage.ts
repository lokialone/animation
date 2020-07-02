import Rect from '@shape/rect';
import Grid from '@shape/grid';
import {fromEvent, Observable, Subject, Subscriber, Subscription} from 'rxjs';
import {convertPosition} from '@utils/index';
import {takeUntil, mergeMap, tap, debounceTime, map, mapTo} from 'rxjs/operators';
import Line from './line';
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
        const hover$ = this.canvasMouseMove$.pipe(debounceTime(100)).subscribe((event: any) => {
            if (this.mode !== ModeType.Edit) return;
            const {x, y} = convertPosition(event as MouseEvent, this.ctx.canvas);
            this.shapes.forEach((sp: Rect) => {
                sp.createPath(this.ctx);
                if (this.ctx.isPointInPath(x, y)) {
                    sp.setHoverState(true);
                } else {
                    sp.setHoverState(false);
                }
            });
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
        const drag$ = this.canvasMouseDown$
            .pipe(
                tap(event => {
                    const {x, y} = convertPosition(event as MouseEvent, this.ctx.canvas);
                    const sp = this.getSeletedShape(x, y);
                    if (sp) {
                        this.saveDrawIngSurface();
                        offsetX = sp.x - x;
                        offsetY = sp.y - y;
                        target = sp;
                    }
                }),
                mergeMap(() =>
                    this.windowMouseMove$.pipe(
                        takeUntil(
                            this.windowMouseUp$.pipe(
                                tap(() => {
                                    target = undefined;
                                }),
                            ),
                        ),
                    ),
                ),
            )
            .subscribe(event => {
                const {x, y} = convertPosition(event as MouseEvent, this.ctx.canvas);
                if (target) {
                    target.x = x + offsetX;
                    target.y = y + offsetY;
                    this.refresh();
                }
            });
        const input$ = this.canvasdblclick$.subscribe(event => {
            const {x, y} = convertPosition(event as MouseEvent, this.ctx.canvas);
            this.shapes.some((sp: Rect) => {
                sp.createPath(this.ctx);
                if (this.ctx.isPointInPath(x, y)) {
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
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    refresh() {
        this.clearCanvas();
        this._drawGrid();
        this._drawShapes();
        console.log('refres', this.shapes);
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
        this.clearCanvas();
        if (this.drag$) this.drag$.unsubscribe();
        if (this.create$) this.create$.unsubscribe();
        this.hover$.unsubscribe();
    }
}
