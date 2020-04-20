import * as utils from '../utils/index';
import {BoundRect} from '../types';
import {fromEvent} from 'rxjs';
import {filter, mergeMap, takeUntil, tap} from 'rxjs/operators';
export default class Slider {
    min: number;
    max: number;
    value: number;
    onchange: Function | null;
    x: number;
    y: number;
    width: number;
    height: number;
    backColor: string;
    backBorderColor: string;
    backWidth: number;
    backX: number;
    handleColor: string;
    handleBorderColor: string;
    handleHeight: number;
    handleY: number;
    bounds: BoundRect | null;
    constructor(min: number, max: number, value: number) {
        this.min = min === undefined ? 0 : min;
        this.max = max === undefined ? 100 : max;
        this.value = value === undefined ? 100 : value;
        this.onchange = null;
        this.x = 0;
        this.y = 0;
        this.width = 16;
        this.height = 100;
        this.bounds = null;
        this.backColor = '#cccccc';
        this.backBorderColor = '#999999';
        this.backWidth = 4;
        this.backX = this.width / 2 - this.backWidth / 2;

        this.handleColor = '#eeeeee';
        this.handleBorderColor = '#cccccc';
        this.handleHeight = 6;
        this.handleY = 0;

        this.updatePosition();
    }
    draw(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.x, this.y);

        //draw back
        context.fillStyle = this.backColor;
        context.beginPath();
        context.fillRect(this.backX, 0, this.backWidth, this.height);
        context.closePath();

        //draw handle
        context.strokeStyle = this.handleBorderColor;
        context.fillStyle = this.handleColor;
        context.beginPath();
        context.rect(0, this.handleY, this.width, this.handleHeight);
        context.closePath();
        context.fill();
        context.stroke();

        context.restore();
    }

    updateValue() {
        const oldValue = this.value,
            handleRange = this.height - this.handleHeight,
            valueRange = this.max - this.min;

        this.value = ((handleRange - this.handleY) / handleRange) * valueRange + this.min;
        if (typeof this.onchange === 'function' && this.value !== oldValue) {
            this.onchange();
        }
    }
    updatePosition() {
        const handleRange = this.height - this.handleHeight,
            valueRange = this.max - this.min;
        this.handleY = handleRange - ((this.value - this.min) / valueRange) * handleRange;
    }

    setHandleBounds() {
        this.bounds = {
            x: this.x,
            y: this.y + this.handleY,
            width: this.width,
            height: this.handleHeight,
        };
    }

    captureMouse(element: HTMLElement) {
        this.setHandleBounds();
        // function onMouseMove() {
        //     const posY = mouse.y - this.y;
        //     this.handleY = Math.min(this.height - this.handleHeight, Math.max(posY, 0));
        //     this.updateValue();
        // }

        // function onMouseUp() {
        //     element.removeEventListener('mousemove', onMouseMove, false);
        //     element.removeEventListener('mouseup', onMouseUp, false);
        //     this.setHandleBounds();
        // }
        if (!this.bounds) return;
        const mouseDown$ = fromEvent(element, 'mousedown');
        const mouseMove$ = fromEvent(element, 'mousemove');
        const mouseUp$ = fromEvent(element, 'mouseup');
        return mouseDown$
            .pipe(
                filter((e: any) => {
                    const {x, y} = utils.convertPosition(e, element);
                    return utils.containPoint(this.bounds as BoundRect, x, y);
                }),
                mergeMap(() => mouseMove$.pipe(takeUntil(mouseUp$.pipe(tap(() => this.setHandleBounds()))))),
            )
            .subscribe((e: any) => {
                const {y} = utils.convertPosition(e, element);
                const posY = y - this.y;
                this.handleY = Math.min(this.height - this.handleHeight, Math.max(posY, 0));
                this.updateValue();
            });
    }
}
