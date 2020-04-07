import React, {useEffect, useRef} from 'react';
import {fromEvent} from 'rxjs';
import {delay, map, throttleTime} from 'rxjs/operators';
import styled from '@emotion/styled';
interface Props {
    path?: string;
}

const Container = styled.div`
    width: 800px;
    height: 500px;
    img {
        width: 60px;
        height: 50px;
        border-radius: 100%;
        border: 3px solid red;
        position: absolute;
        transform: translate3d(0, 0, 0);
    }
`;

const BallsMove = (props: Props) => {
    const container = useRef<any>(null);
    useEffect(() => {
        const con = container.current;
        if (!con) return;
        const con$ = fromEvent(con, 'mousemove').pipe(map((e: any) => ({x: e.clientX, y: e.clientY})));
        const imgList = document.getElementsByTagName('img');
        Array.from(imgList).forEach((item, index: number) => {
            con$.pipe(delay((600 * (Math.pow(0.65, index) + Math.cos(index / 4))) / 2)).subscribe(pos => {
                item.style.left = pos.x + 'px';
                item.style.top = pos.y + 'px';
            });
        });
    }, []);
    return (
        <Container ref={container}>
            <div>当前区域滑动鼠标</div>
            <img src="/logo192.png" alt="" />
            <img src="/logo192.png" alt="" />
            <img src="/logo192.png" alt="" />
            <img src="/logo192.png" alt="" />
            <img src="/logo192.png" alt="" />
            <img src="/logo192.png" alt="" />
            <img src="/logo192.png" alt="" />
        </Container>
    );
};

export default BallsMove;
