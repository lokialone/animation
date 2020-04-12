import {BoundRect} from '../types';
interface PositionType {
    x: number;
    y: number;
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
        },
        false,
    );
    element.addEventListener(
        'touchend',
        () => {
            touch.isPress = false;
            touch.x = 0;
            touch.y = 0;
        },
        false,
    );

    element.addEventListener(
        'touchmove',
        (event: TouchEvent) => {
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
            x -= element.offsetLeft;
            y -= element.offsetTop;
            touch.x = x;
            touch.y = y;
        },
        false,
    );
    return touch;
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
    if (alpha === 1) return `ragb(${red}, ${green}, ${blue})`;
    return `ragb(${red}, ${green}, ${blue}, ${alpha})`;
}

export function containPoint(rect: BoundRect, x: number, y: number): boolean {
    return !(x < rect.x || x > rect.x + rect.width || y < rect.y || y > rect.y + rect.height);
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
