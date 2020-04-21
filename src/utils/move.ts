import Ball from '../shape/ball';
import Line from '../shape/line';
import Segment from '../shape/segment';
import {BasicMoveItem} from '../types';
export function gravity(nodeA: Ball, nodeB: Ball) {
    const dx = nodeB.x - nodeA.x;
    const dy = nodeB.y - nodeA.y;
    const distSquared = dx * dx + dy * dy;
    const dist = Math.sqrt(distSquared);
    const force = (nodeA.mass * nodeB.mass) / distSquared;
    const ax = (force * dx) / dist;
    const ay = (force * dy) / dist;
    nodeA.vx += ax / nodeA.mass;
    nodeA.vy += ay / nodeA.mass;
    nodeB.vx -= ax / nodeA.mass;
    nodeB.vy -= ay / nodeA.mass;
}

export function rotate(x: number, y: number, sin: number, cos: number, reverse: boolean) {
    return {
        x: reverse ? x * cos + y * sin : x * cos - y * sin,
        y: reverse ? y * cos - x * sin : y * cos + x * sin,
    };
}
// 弹力运动
export function springBetween(from: BasicMoveItem, target: BasicMoveItem, minDist = 0, springAmount = 0.01) {
    const dx = from.x - target.x;
    const dy = from.y - target.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < minDist) {
        const ax = dx * springAmount;
        const ay = dy * springAmount;
        from.vx += ax;
        from.vy += ay;
        target.vx -= ax;
        target.vy -= ay;
    }
}

export function springTo(from: BasicMoveItem, target: BasicMoveItem, spring = 0.01) {
    from.vx += (target.x - from.x) * spring;
    from.vy += (target.y - from.y) * spring;
}
// 检测球体相撞
export function checkCollision(ball0: Ball, ball1: Ball) {
    const dx = ball1.x - ball0.x;
    const dy = ball1.y - ball0.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < ball0.radius + ball1.radius) {
        const angle = Math.atan2(dy, dx);
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        // rotate coordinates
        const pos0 = {x: 0, y: 0};
        const pos1 = rotate(dx, dy, sin, cos, true);
        // rotate velocity
        const vel0 = rotate(ball0.vx, ball0.vy, sin, cos, true);
        const vel1 = rotate(ball1.vx, ball1.vy, sin, cos, true);
        // calculate v0f v1f
        const vxTotal = vel0.x - vel1.x;
        vel0.x = ((ball0.mass - ball1.mass) * vel0.x + 2 * ball1.mass * vel1.x) / (ball0.mass + ball1.mass);
        vel1.x = vxTotal + vel0.x;
        // to avoid overlap;
        const absV = Math.abs(vel0.x) + Math.abs(vel1.x);
        const overlap = ball0.radius + ball1.radius - Math.abs(pos0.x - pos1.x);
        pos0.x += (vel0.x / absV) * overlap;
        pos1.x += (vel1.x / absV) * overlap;
        // rotate back
        const pos0F = rotate(pos0.x, pos0.y, sin, cos, false);
        const pos1F = rotate(pos1.x, pos1.y, sin, cos, false);

        ball1.x = ball0.x + pos1F.x;
        ball1.y = ball0.y + pos1F.y;
        ball0.x = ball0.x + pos0F.x;
        ball0.y = ball0.y + pos0F.y;
        const vel0F = rotate(vel0.x, vel0.y, sin, cos, false);
        const vel1F = rotate(vel1.x, vel1.y, sin, cos, false);
        ball0.vx = vel0F.x;
        ball0.vy = vel0F.y;
        ball1.vx = vel1F.x;
        ball1.vy = vel1F.y;
    }
}

// 检测斜边约球相撞
export function checkLine(line: Line, ball: Ball, bounce = -1) {
    const bounds = line.getBounds();

    if (ball.x + ball.radius > bounds.x && ball.x - ball.radius < bounds.x + bounds.width) {
        //get angle, sine, and cosine
        const cos = Math.cos(line.rotation);
        const sin = Math.sin(line.rotation);
        //get position of ball, relative to line
        let x1 = ball.x - line.x;
        let y1 = ball.y - line.y;
        //rotate coordinates
        let y2 = cos * y1 - sin * x1;
        //rotate velocity
        let vy1 = cos * ball.vy - sin * ball.vx;
        //perform bounce with rotated values
        if (y2 > -ball.radius && y2 < vy1) {
            //rotate coordinates
            const x2 = cos * x1 + sin * y1;
            //rotate velocity
            const vx1 = cos * ball.vx + sin * ball.vy;
            y2 = -ball.radius;
            vy1 *= bounce;
            //rotate everything back
            x1 = cos * x2 - sin * y2;
            y1 = cos * y2 + sin * x2;
            ball.vx = cos * vx1 - sin * vy1;
            ball.vy = cos * vy1 + sin * vx1;
            ball.x = line.x + x1;
            ball.y = line.y + y1;
        }
    }
}
// 缓动
export function ease(ball: any, targetX: number, targetY: number, ease = 0.02) {
    ball.x += (targetX - ball.x) * ease;
    ball.y += (targetY - ball.y) * ease;
}
export enum CheckBoundariesMode {
    bounce,
    reset,
    remove,
    othersdie = 'to other side',
}
export function checkBoundaries(ball: Ball, canvas: HTMLCanvasElement, mode = CheckBoundariesMode.bounce, bounce = -1) {
    if (mode === CheckBoundariesMode.bounce) {
        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.vx *= bounce;
        } else if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.vx *= bounce;
        }
        if (ball.y + ball.radius > canvas.height) {
            ball.y = canvas.height - ball.radius;
            ball.vy *= bounce;
        } else if (ball.y - ball.radius < 0) {
            ball.y = ball.radius;
            ball.vy *= bounce;
        }
    }
    // TODO
    if (mode === CheckBoundariesMode.reset) {
    }
}

export function walk(segment1: Segment, segment2: Segment, cyc: number, offset = -1.3) {
    const angle1 = ((Math.sin(cyc) * 45 + 90) * Math.PI) / 180;
    const angle2 = ((Math.sin(cyc + offset) * 45 + 45) * Math.PI) / 180;
    segment1.rotation = angle1;
    segment2.rotation = angle1 + angle2;
    const {x, y} = segment1.getPin();
    const {x: x1, y: y1} = segment2.getPin();

    segment2.x = x;
    segment2.y = y;
    segment2.vx = segment2.getPin().x - x1;
    segment2.vy = segment2.getPin().y - y1;
}
