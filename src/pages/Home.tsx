import React from 'react';
import NavLink from '../components/NavLink';
const Home = (props: any) => {
    return (
        <div>
            <ul>
                <li>
                    <NavLink to="about">About</NavLink>
                </li>
                <li>
                    <NavLink to="support">Support</NavLink>
                </li>
                <li>
                    <NavLink to="dashboard">Dashboard</NavLink>
                </li>
            </ul>
            {props.children}
        </div>
    );
};

export default Home;
