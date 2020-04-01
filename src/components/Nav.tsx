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
                        <NavLink to="rxjs">rxjs</NavLink>
                    </li>
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
                </ul>
            </Nav>
            {/* <div>{props.children}</div> */}
        </div>
    );
};

export default Home;