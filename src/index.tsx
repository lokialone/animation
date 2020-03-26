import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from '@reach/router';
import './index.css';
// import App from './App';
import * as serviceWorker from './serviceWorker';
import Home from './pages/Home';
import About from './pages/About';
import Rxjs from './pages/Rxjs';
ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Home path="/">
                <Rxjs path="/" />
                <About path="about" />
            </Home>
        </Router>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
