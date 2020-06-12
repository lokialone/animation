import React, {useEffect, useRef, useState} from 'react';
import {fromEvent, Observable, Subject, Subscriber} from 'rxjs';
import styled from '@emotion/styled';
import {css} from '@emotion/core';
import Rect from '../../shape/rect';
import {useImmer} from 'use-immer';
import Stage, {ModeType} from './Stage';
interface SimpleButtonProps {
    isActive?: boolean;
}

interface TextInputInfo {
    value: string;
    show: boolean;
    x: number;
    y: number;
}

const TextInput = styled.input`
    position: absolute;
    left: ${(props: TextInputInfo) => props.x + 'px'};
    top: ${(props: TextInputInfo) => props.y + 'px'};
`;
const SimpleButton = styled.button`
    border-radius: 4px;
    display: inline-block;
    color: #31445b;
    background: white;
    border: 1px solid #31445b;
    padding: 4px 8px;
    font-size: 12px;
    ${(props: SimpleButtonProps) =>
        props.isActive &&
        css`
            background: #31445b;
            color: white;
        `}
    margin: 8px;
    text-align: center;
`;
const Container = styled.div`
    position: relative;
    height: 100vh;
    cursor: pointer;
`;
const ease$ = new Subject<React.MouseEvent<any>>();
const edit$ = new Subject<React.MouseEvent<any>>();
const create$ = new Subject<React.MouseEvent<any>>();
let inputingShape: Rect | null;
const DrawShape = (props: {path: string}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isEdit, setEdit] = useState<boolean>(false);
    const [textInputInfo, setTextInputInfo] = useImmer<TextInputInfo>({value: '', show: false, x: 0, y: 0});
    const textInputOnChange = (e: any) => {
        const value = e.target && e.target.value;
        setTextInputInfo(draft => {
            draft.value = value;
        });
    };
    const textInputOnKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            if (isEdit && inputingShape) inputingShape.setContent(textInputInfo.value);
            setTextInputInfo(draft => {
                draft.show = false;
                draft.value = '';
            });
        }
    };
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;
        const stage = new Stage(context);
        const unEdit$ = edit$.subscribe(() => {
            setEdit(true);
            stage.setMode(ModeType.Edit);
        });
        const unCreate$ = create$.subscribe(() => {
            setEdit(false);
            stage.setMode(ModeType.Create);
        });
        const unEase$ = ease$.subscribe(() => {
            stage.reset();
        });

        return () => {
            unEdit$.unsubscribe();
            unCreate$.unsubscribe();
            unEase$.unsubscribe();
            stage.destroy();
        };
    }, []);
    return (
        <Container>
            <div id="controls">
                <div>
                    <SimpleButton onClick={e => edit$.next(e)} isActive={isEdit === true}>
                        编辑
                    </SimpleButton>
                    <SimpleButton onClick={e => create$.next(e)} isActive={isEdit === false}>
                        创建
                    </SimpleButton>
                    <SimpleButton onClick={e => ease$.next(e)} isActive={false}>
                        清除
                    </SimpleButton>
                    <span style={{fontSize: '12px'}}>编辑时 1.双击可输入文字 2.可拖拽</span>
                </div>
                <div></div>
                <div style={{position: 'relative', display: 'flex'}}>
                    <div style={{position: 'relative'}}>
                        {textInputInfo.show && (
                            <TextInput
                                type="text"
                                {...textInputInfo}
                                onChange={textInputOnChange}
                                onKeyPress={textInputOnKeyPress}
                            />
                        )}
                        <canvas ref={canvasRef} width={800} height={600}></canvas>
                    </div>
                    <div>样式编辑区 当前选中节点</div>
                </div>
            </div>
        </Container>
    );
};

export default DrawShape;
