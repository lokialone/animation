import React, {useRef, useEffect} from 'react';
import Ocean from './Ocean.class';
import './ocean.style.css';

const OceanPage = (props: {path: string}) => {
    const ref = useRef(null);
    useEffect(() => {
        const container = ref.current;
        if (!container) return;

        const ocean = new Ocean({
            container: container,
        });
        return () => {
            ocean.destroy();
        };
    }, []);

    return <div ref={ref} className="webgl-ocean"></div>;
};

export default OceanPage;
