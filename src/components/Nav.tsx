import React from 'react';
import NavLink from './NavLink';
import styled from '@emotion/styled';
import {keyframes} from '@emotion/core';
const move = keyframes`
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
`;
const Nav = styled.div`
    width: 200px;
    background: #31445b;
    height: 100vh;
    li {
        height: 30px;
        line-height: 30px;
        list-style-type: none;
        font-weight: 500;

        a:hover {
            position: relative;
        }
        a:hover:after {
            position: absolute;
            content: attr(data-text);
            color: #1bfaad;
            left: 0;
            overflow: hidden;
            white-space: nowrap;
            animation: ${move} 1s forwards steps(10, start);
        }
    }
`;

const NavConfig = [
    {
        label: 'Webgl',
        value: 'Webgl',
    },
    {
        label: '帧动画',
        value: 'Sprite',
    },
    {
        label: '粒子动画',
        value: 'NodeGarden',
    },
    {
        label: '正向运动-行走',
        value: 'Segment',
    },
    {
        label: '反向运动-拖拽',
        value: 'SegmentDrag',
    },
    {
        label: 'TextParticles',
        value: 'TextParticles',
    },
    {
        label: '绘制编辑图形',
        value: 'DrawShape',
    },
    {
        label: '图片区域选择',
        value: 'ImageOperate',
    },
    {
        label: '图片拉扯形变todo',
        value: 'ImageTransform',
    },
    {
        label: '图片转场动效',
        value: 'ImageFade',
    },
    {
        label: 'RandomBall',
        value: 'RandomBall',
    },
    {
        value: 'DragDraw',
    },
    {
        label: '抛球',
        value: 'BallDrag',
    },
    {
        label: '飞船',
        value: 'ShipGame',
    },
    {
        label: '弹动-TODO',
        value: 'Spring',
    },
    {
        label: '多物体弹动',
        value: 'Spring3',
    },
    {
        label: '多目标弹动',
        value: 'Spring4',
    },
    {
        label: '双向弹动',
        value: 'Spring5',
    },
    {
        label: 'box碰撞检测',
        value: 'Box',
    },
    {
        label: '多斜面反弹',
        value: 'MultiAngleBounce',
    },
    {
        label: '动量守恒',
        value: 'PE',
    },
    {
        label: '图片上传todo',
        value: 'FileUpload',
    },
    {
        label: 'Test',
        value: 'Test',
    },
];
const Home = (props: any) => {
    return (
        <div>
            <Nav>
                <ul>
                    {NavConfig.map(config => (
                        <li key={config.value}>
                            <NavLink to={config.value} data-text={config.label || config.value}>
                                {config.label || config.value}
                            </NavLink>
                        </li>
                    ))}
                    {/* <li>
                        <NavLink to="rotation">rotation to mouse</NavLink>
                    </li> */}

                    {/* <li>
                        <NavLink to="BouncingBall">BouncingBall</NavLink>
                    </li> */}
                    {/* <li>
                        <NavLink to="rxjs">rxjs</NavLink>
                    </li> */}
                    {/* <li>
                        <NavLink to="DrawCurve1">DrawCurve1</NavLink>
                    </li>
                    <li>
                        <NavLink to="DrawCurve2">DrawCurve2</NavLink>
                    </li> */}
                    {/* <li>
                        <NavLink to="DrawMultiCurve">DrawMultiCurve</NavLink>
                    </li> */}
                    {/* <li>
                        <NavLink to="BallMove">BallMove</NavLink>
                    </li> */}
                    {/* <li>
                        <NavLink to="BallsMove">BallsMove</NavLink>
                    </li> */}
                    {/* <li>
                        <NavLink to="InvertColor">图片颜色修改</NavLink>
                    </li> */}
                    {/* <li>
                        <NavLink to="PixelMove">我瞎了</NavLink>
                    </li> */}
                    {/* <li>
                        <NavLink to="SprayPrint">喷漆</NavLink>
                    </li> */}
                    {/* <li>
                        <NavLink to="Ease">缓动</NavLink>
                    </li> */}
                    {/* <li>
                        <NavLink to="Spring2">弹动2</NavLink>
                    </li> */}
                    {/* <li>
                        <NavLink to="Bubbles">ball弹性碰撞</NavLink>
                    </li> */}
                    {/* <li>
                        <NavLink to="Rotate">坐标旋转</NavLink>
                    </li> */}
                    {/* <li>
                        <NavLink to="AngleBounce">斜面反弹</NavLink>
                    </li> */}

                    {/* <li>
                        <NavLink to="Bounce3d">3d反弹</NavLink>
                    </li> */}
                </ul>
            </Nav>
            {/* <div>{props.children}</div> */}
        </div>
    );
};

export default Home;
