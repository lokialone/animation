import React, {useEffect, useRef, useState, useCallback} from 'react';
import ImageLazy from '../components/ImageLazy';
interface Props {
    path?: string;
}

type pathMeta = [string, string, number];
type to = [string, number];
interface Paths {
    [key: string]: to[];
}
const Test = (props: Props) => {
    /** Search info action */

    return (
        <div>
            <div style={{position: 'relative', height: '120vh', background: 'lightgreen'}}> </div>
            <ImageLazy url="/logo192.png"></ImageLazy>
            <div>
                <ImageLazy url="/01.jpeg"></ImageLazy>
            </div>
        </div>
    );
};

export default Test;
