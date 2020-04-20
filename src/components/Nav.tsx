import React from 'react';
import NavLink from './NavLink';
import styled from '@emotion/styled';
const Nav = styled.div`
    width: 200px;
    background: #f2f2f2;
    height: 100vh;
`;
const Home = (props: any) => {
    return (
        <div>
            <Nav>
                <ul>
                    <li>
                        <NavLink to="rotation">rotation to mouse</NavLink>
                    </li>
                    <li>
                        <NavLink to="RandomBall">RandomBall</NavLink>
                    </li>
                    <li>
                        <NavLink to="BouncingBall">BouncingBall</NavLink>
                    </li>
                    {/* <li>
                        <NavLink to="rxjs">rxjs</NavLink>
                    </li> */}
                    <li>
                        <NavLink to="DragDraw">DragDraw</NavLink>
                    </li>
                    <li>
                        <NavLink to="DrawCurve1">DrawCurve1</NavLink>
                    </li>
                    <li>
                        <NavLink to="DrawCurve2">DrawCurve2</NavLink>
                    </li>
                    <li>
                        <NavLink to="DrawMultiCurve">DrawMultiCurve</NavLink>
                    </li>
                    <li>
                        <NavLink to="BallMove">BallMove</NavLink>
                    </li>
                    <li>
                        <NavLink to="BallDrag">抛球</NavLink>
                    </li>
                    <li>
                        <NavLink to="BallsMove">BallsMove</NavLink>
                    </li>
                    <li>
                        <NavLink to="InvertColor">图片颜色修改</NavLink>
                    </li>
                    <li>
                        <NavLink to="PixelMove">我瞎了</NavLink>
                    </li>
                    <li>
                        <NavLink to="SprayPrint">喷漆</NavLink>
                    </li>
                    <li>
                        <NavLink to="ShipGame">飞船~</NavLink>
                    </li>
                    <li>
                        <NavLink to="Ease">缓动</NavLink>
                    </li>
                    <li>
                        <NavLink to="Spring">弹动</NavLink>
                    </li>
                    <li>
                        <NavLink to="Spring2">弹动2</NavLink>
                    </li>
                    <li>
                        <NavLink to="Spring3">多物体弹动</NavLink>
                    </li>
                    <li>
                        <NavLink to="Spring4">多目标弹动</NavLink>
                    </li>
                    <li>
                        <NavLink to="Spring5">双向弹动</NavLink>
                    </li>
                    <li>
                        <NavLink to="Box">box碰撞检测</NavLink>
                    </li>
                    <li>
                        <NavLink to="Bubbles">ball弹性碰撞</NavLink>
                    </li>
                    <li>
                        <NavLink to="Rotate">坐标旋转</NavLink>
                    </li>
                    <li>
                        <NavLink to="AngleBounce">斜面反弹</NavLink>
                    </li>
                    <li>
                        <NavLink to="MultiAngleBounce">多斜面反弹</NavLink>
                    </li>
                    <li>
                        <NavLink to="PE">动量守恒</NavLink>
                    </li>
                    <li>
                        <NavLink to="NodeGarden">粒子动画</NavLink>
                    </li>
                    <li>
                        <NavLink to="Test">Test</NavLink>
                    </li>
                </ul>
            </Nav>
            {/* <div>{props.children}</div> */}
        </div>
    );
};

export default Home;
