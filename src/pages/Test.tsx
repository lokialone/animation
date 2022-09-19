import React from 'react';

interface Props {
    path?: string;
}

const Test = (props: Props) => {
    return (
        <div
            style={{
                display: 'flex',
                width: '400px',
                background: 'gray',
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: '5px',
            }}>
            <div style={{margin: 5, minWidth: '100px', background: 'red', flex: '1 1 0'}}>1</div>
            <div style={{margin: 5, minWidth: '100px', background: 'red', flex: '2 1 0'}}>2</div>
            <div style={{margin: 5, minWidth: '100px', background: 'red', flex: '3 1 0'}}>3</div>
            <div style={{margin: 5, minWidth: '100px', background: 'red'}}>4</div>
            <div style={{margin: 5, minWidth: '100px', background: 'red'}}>5</div>
        </div>
    );
};

export default Test;
