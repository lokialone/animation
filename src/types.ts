export interface BoundRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface BasicMoveItem {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius?: number;
}
export interface Position2d {
    x: number;
    y: number;
}
export interface Position3d extends Position2d {
    z: number;
}

export interface Position extends Position2d {
    z?: number;
}
