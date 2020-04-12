import React, {useEffect, useRef, useState, useCallback} from 'react';
// import Arrow from '../shape/arrow';
// import {captureMouse} from '../utils/index';
// import raf from 'raf';
import {Subject} from 'rxjs';
interface Props {
    path?: string;
}

const Test = (props: Props) => {
    /** Search base infos */
    const [searchID, setSearchID] = useState(0);
    const [button$] = useState(() => {
        return new Subject<React.MouseEvent<HTMLButtonElement>>();
    });
    const onSearchInfos = () => {
        console.log(searchID);
        const fetchUrl = '/api/getSearchInfos';
        const fetchParams = {searchID};
        fetch(fetchUrl, {
            method: 'POST',
            body: JSON.stringify(fetchParams),
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
            });
    };
    useEffect(() => {
        setSearchID(searchID + 1);
        console.log(searchID);
        setTimeout(() => {
            // debugger;
            console.log(searchID);
        }, 2000);
        // button$.subscribe(function () {
        //     debugger;
        //     console.log(searchID);
        //     onSearchInfos();
        // });
        return () => {
            button$.unsubscribe();
        };
    }, []);
    /** Search info action */

    return (
        <>
            <button
                onClick={() => {
                    setSearchID(searchID + 1);
                }}>
                button1
            </button>
            <button
                onClick={e => {
                    console.log(searchID);
                    button$.next(e);
                }}>
                button2
            </button>
        </>
    );
};

export default Test;
