import React from 'react';
import {Link} from '@reach/router';

export default ({partial = false, ...props}) => (
    <Link
        {...props}
        to={props.to}
        getProps={({isCurrent, isPartiallyCurrent}) => {
            const isActive = partial ? isPartiallyCurrent : isCurrent;
            return {
                style: {
                    color: isActive ? '#1bfaad' : 'rgba(255, 255, 255, 0.8)',
                },
            };
        }}
    />
);
