import React from 'react';
import NavLink from './NavLink';
import styled from '@emotion/styled';
import {keyframes} from '@emotion/core';
import NavConfig from '../nav.config';
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
                </ul>
            </Nav>
        </div>
    );
};

export default Home;
