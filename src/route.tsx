import React from 'react';
import {Router} from '@reach/router';
import Rotation from './pages/Rotation';
import RandomBall from './pages/RandomBall';
import DragDraw from './pages/DragDraw';
import DrawCurve1 from './pages/DrawCurve1';
import DrawCurve2 from './pages/DrawCurve2';
import DrawMultiCurve from './pages/DrawMultiCurve';
import BallMove from './pages/BallMove';
import BallDrag from './pages/BallDrag';
import BallsMove from './pages/BallsMove';
import Test from './pages/Test';
import Rxjs from './pages/Rxjs';
import InvertColor from './pages/InvertColor';
import PixelMove from './pages/PixelMove';
import SprayPrint from './pages/SprayPrint';
import ShipGame from './pages/ShipGame';
import BouncingBall from './pages/BouncingBall';
import Ease from './pages/Ease';
import Spring from './pages/Spring';
import Spring2 from './pages/Spring2';
import Spring3 from './pages/Spring3';
import Spring4 from './pages/Spring4';
import Spring5 from './pages/Spring5';
import Box from './pages/Box';
import Bubbles from './pages/Bubbles';
import Rotate from './pages/Rotate';
import AngleBounce from './pages/AngleBounce';
import MultiAngleBounce from './pages/MultiAngleBounce';
import PE from './pages/PE';
import NodeGarden from './pages/NodeGarden';
import Segment from './pages/Segment';
import SegmentDrag from './pages/SegmentDrag';
import Bounce3d from './pages/Bounce3d';
import ImageOperate from './pages/ImageOperate';
import ImageTransform from './pages/ImageTransform';
import TextParticles from './pages/TextParticles';
import DrawShape from './pages/DrawShape/index';
import FileUpload from './pages/FileUpload';
import ImageFade from './pages/ImageFade';
const Route = () => (
    <Router>
        <DrawShape path="DrawShape"></DrawShape>
        <ImageOperate path="ImageOperate"></ImageOperate>
        <ImageFade path="ImageFade"></ImageFade>
        <Rxjs path="rxjs"></Rxjs>
        <Rotation path="rotation" />
        <RandomBall path="RandomBall"></RandomBall>
        <DragDraw path="DragDraw"></DragDraw>
        <DrawCurve1 path="DrawCurve1"></DrawCurve1>
        <DrawCurve2 path="DrawCurve2"></DrawCurve2>
        <DrawMultiCurve path="DrawMultiCurve"></DrawMultiCurve>
        <BallMove path="BallMove"></BallMove>
        <BallDrag path="BallDrag"></BallDrag>
        <BallsMove path="BallsMove"></BallsMove>
        <InvertColor path="InvertColor"></InvertColor>
        <PixelMove path="PixelMove"></PixelMove>
        <SprayPrint path="SprayPrint"></SprayPrint>
        <ShipGame path="ShipGame"></ShipGame>
        <BouncingBall path="BouncingBall"></BouncingBall>
        <Ease path="Ease"></Ease>
        <Spring2 path="Spring2"></Spring2>
        <Spring3 path="Spring3"></Spring3>
        <Spring4 path="Spring4"></Spring4>
        <Spring5 path="Spring5"></Spring5>
        <Spring path="Spring"></Spring>
        <Box path="Box"></Box>
        <Bubbles path="Bubbles"></Bubbles>
        <Rotate path="Rotate"></Rotate>
        <AngleBounce path="AngleBounce"></AngleBounce>
        <MultiAngleBounce path="MultiAngleBounce"></MultiAngleBounce>
        <PE path="PE"></PE>
        <NodeGarden path="NodeGarden"></NodeGarden>
        <Segment path="Segment"></Segment>
        <SegmentDrag path="SegmentDrag"></SegmentDrag>
        <Bounce3d path="Bounce3d"></Bounce3d>
        <ImageTransform path="ImageTransform"></ImageTransform>
        <TextParticles path="TextParticles"></TextParticles>
        <FileUpload path="FileUpload"></FileUpload>
        <Test path="Test"></Test>
    </Router>
);
export default Route;
