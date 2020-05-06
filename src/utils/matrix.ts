/**
 * 解三元一次方程，需要传入三组方程参数
 * @param arr1        第一组参数
 * @param arr2        第二组参数
 * @param arr3        第三组参数
 * @returns {x: number, y: number, z: number}
 */

import {Position} from '../types';
function equation(arr1: number[], arr2: number[], arr3: number[]) {
    const a1 = +arr1[0];
    const b1 = +arr1[1];
    const c1 = +arr1[2];
    const d1 = +arr1[3];

    const a2 = +arr2[0];
    const b2 = +arr2[1];
    const c2 = +arr2[2];
    const d2 = +arr2[3];

    const a3 = +arr3[0];
    const b3 = +arr3[1];
    const c3 = +arr3[2];
    const d3 = +arr3[3];

    //分离计算单元
    const m1 = c1 - (b1 * c2) / b2;
    const m2 = c2 - (b2 * c3) / b3;
    const m3 = d2 - (b2 * d3) / b3;
    const m4 = a2 - (b2 * a3) / b3;
    const m5 = d1 - (b1 * d2) / b2;
    const m6 = a1 - (b1 * a2) / b2;

    //计算xyz
    const x = ((m1 / m2) * m3 - m5) / ((m1 / m2) * m4 - m6);
    const z = (m3 - m4 * x) / m2;
    const y = (d1 - a1 * x - c1 * z) / b1;

    return {
        x: x,
        y: y,
        z: z,
    };
}

/**
 * 根据变化前后的点坐标，计算矩阵
 * @param arg1     变化前坐标1
 * @param _arg1    变化后坐标1
 * @param arg2     变化前坐标2
 * @param _arg2    变化后坐标2
 * @param arg3     变化前坐标3
 * @param _arg3    变化后坐标3
 * @returns {{a: number, b: number, c: number, d: number, e: number, f: number}}
 */
function getMatrix2d(
    arg1: Position,
    _arg1: Position,
    arg2: Position,
    _arg2: Position,
    arg3: Position,
    _arg3: Position,
) {
    //传入x值解第一个方程 即  X = ax + cy + e 求ace
    //传入的四个参数，对应三元一次方程：ax+by+c=d的四个参数：a、b、c、d，跟矩阵方程对比c为1
    const arr1 = [arg1.x, arg1.y, 1, _arg1.x];
    const arr2 = [arg2.x, arg2.y, 1, _arg2.x];
    const arr3 = [arg3.x, arg3.y, 1, _arg3.x];

    const result = equation(arr1, arr2, arr3);

    //传入y值解第二个方程 即  Y = bx + dy + fz 求 bdf
    arr1[3] = _arg1.y;
    arr2[3] = _arg2.y;
    arr3[3] = _arg3.y;

    const result2 = equation(arr1, arr2, arr3);

    //获得a、c、e
    const a = result.x;
    const c = result.y;
    const e = result.z;

    //获得b、d、f
    const b = result2.x;
    const d = result2.y;
    const f = result2.z;

    return {
        a: a,
        b: b,
        c: c,
        d: d,
        e: e,
        f: f,
    };
}

export default getMatrix2d;
