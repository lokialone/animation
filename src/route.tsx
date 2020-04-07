import React from 'react';
import {Router} from '@reach/router';
import Rotation from './pages/Rotation';
import RandomBall from './pages/RandomBall';
import DragDraw from './pages/DragDraw';
import DrawCurve1 from './pages/DrawCurve1';
import DrawCurve2 from './pages/DrawCurve2';
import DrawMultiCurve from './pages/DrawMultiCurve';
import BallMove from './pages/BallMove';
import BallsMove from './pages/BallsMove';
import Test from './pages/Test';
import Rxjs from './pages/Rxjs';
import InvertColor from './pages/InvertColor';
const Route = () => (
    <Router>
        <Rxjs path="rxjs"></Rxjs>
        <Rotation path="rotation" />
        <RandomBall path="RandomBall"></RandomBall>
        <DragDraw path="DragDraw"></DragDraw>
        <DrawCurve1 path="DrawCurve1"></DrawCurve1>
        <DrawCurve2 path="DrawCurve2"></DrawCurve2>
        <DrawMultiCurve path="DrawMultiCurve"></DrawMultiCurve>
        <BallMove path="BallMove"></BallMove>
        <BallsMove path="BallsMove"></BallsMove>
        <InvertColor path="InvertColor"></InvertColor>
        <Test path="Test"></Test>
    </Router>
);
export default Route;
