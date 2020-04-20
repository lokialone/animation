import {BoundRect} from '../types';
interface PositionType {
    x: number;
    y: number;
}

// for rxjs
export function convertPosition(event: MouseEvent | TouchEvent, element: HTMLElement, isTouch = false) {
    let x = 0;
    let y = 0;
    const currentEvent = isTouch ? (event as TouchEvent).touches[0] : (event as MouseEvent);
    if (currentEvent.pageX && currentEvent.pageY) {
        x = currentEvent.pageX;
        y = currentEvent.pageY;
    } else {
        x = currentEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        x = currentEvent.clientX + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= element.getBoundingClientRect().left;
    y -= element.getBoundingClientRect().top;
    return {x, y};
}
export function captureMouse(element: HTMLElement): PositionType {
    const mouse: PositionType = {x: 0, y: 0};
    element.addEventListener(
        'mousemove',
        (event: MouseEvent) => {
            let x = 0;
            let y = 0;
            if (event.pageX && event.pageY) {
                x = event.pageX;
                y = event.pageY;
            } else {
                x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                x = event.clientX + document.body.scrollTop + document.documentElement.scrollTop;
            }
            x -= element.getBoundingClientRect().left;
            y -= element.getBoundingClientRect().top;
            mouse.x = x;
            mouse.y = y;
        },
        false,
    );
    return mouse;
}

export function captureTouch(element: HTMLElement): {x: number; y: number; isPress: boolean} {
    const touch = {x: 0, y: 0, isPress: false};
    element.addEventListener(
        'touchestart',
        () => {
            touch.isPress = true;
            console.log('touchestart');
        },
        false,
    );
    element.addEventListener(
        'touchend',
        () => {
            console.log('touchend');
            touch.isPress = false;
            touch.x = 0;
            touch.y = 0;
        },
        false,
    );

    element.addEventListener(
        'touchmove',
        (event: TouchEvent) => {
            console.log('touchmove');
            let x = 0;
            let y = 0;
            const touchEvent = event.touches[0];
            if (touchEvent.pageX && touchEvent.pageY) {
                x = touchEvent.pageX;
                y = touchEvent.pageY;
            } else {
                x = touchEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                x = touchEvent.clientX + document.body.scrollTop + document.documentElement.scrollTop;
            }
            x -= element.getBoundingClientRect().left;
            y -= element.getBoundingClientRect().top;
            touch.x = x;
            touch.y = y;
        },
        false,
    );
    return touch;
}
export function isTouchMode(): boolean {
    return 'ontouchend' in document;
}

/**
 * #ff0000, 0.1  ==> rgba(255,0,0,0.1)
 * ff0000, 0.1 ===> rgba(255,0,0,0.1)
 * */
export function colorHexToRGB(color: string, alpha = 1): string {
    let _color = 0;
    if (typeof color === 'string' && color.charAt(0) === '#') {
        _color = parseInt(color.slice(1), 16);
    } else if (typeof color === 'string') {
        _color = parseInt(color, 16);
    } else {
        throw new Error('colorHexToRGB参数color不是形如#ff0000的格式');
    }
    const red = (_color >> 16) & 0xff;
    const green = (_color >> 8) & 0xff;
    const blue = _color & 0xff;
    if (alpha === 1) return `rgba(${red}, ${green}, ${blue})`;
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function containPoint(rect: BoundRect, x: number, y: number): boolean {
    return !(x < rect.x || x > rect.x + rect.width || y < rect.y || y > rect.y + rect.height);
}

export function getDirect(pos1: number, pos2: number) {
    if (pos1 - pos2 === 0) return 0;
    return (pos1 - pos2) / Math.abs(pos1 - pos2);
}

export function getDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function intersects(rectA: BoundRect, rectB: BoundRect) {
    return !(
        rectA.x + rectA.width < rectB.x ||
        rectB.x + rectB.width < rectA.x ||
        rectA.y + rectA.height < rectB.y ||
        rectB.y + rectB.height < rectA.y
    );
}

/**
 * #ff0000,
 * ff0000, 0.1 ===> rgba(255,0,0,0.1)
 * */
export function parseColor(color: string | number, toNumber = false): string | number {
    if (toNumber) {
        if (typeof color === 'number') {
            return color || 0;
        } else if (typeof color === 'string') {
            let _color = '';
            color.charAt(0) === '#' ? (_color = color.slice(1)) : (_color = color);
            return parseInt(_color, 16);
        } else {
            throw new Error('Invalid color');
        }
    } else {
        if (typeof color === 'number') {
            return '#' + ('0000' + (color | 0).toString(16).substring(-6));
        }
        return '';
    }
}
