import React, {useState, useEffect, useRef} from 'react';

export default (props: {url: string}) => {
    const [img, setImage] = useState('/logo512.png');
    const ref = useRef<HTMLImageElement>(null);
    useEffect(() => {
        // c
        const img = ref.current;
        if (!img) return;
        const intersection = new IntersectionObserver(
            function (entries) {
                console.log('pb', entries[0]);

                if (entries[0].isIntersecting || entries[0].intersectionRatio > 0) {
                    setImage(props.url);
                    intersection.unobserve(img);
                    img.removeAttribute('data-src');
                }
            },
            {
                root: null,
                threshold: 0.1, // 阀值设为1，当只有比例达到1时才触发回调函数
            },
        );
        intersection.observe(img);
    }, []);
    return (
        <>
            <div
                style={{
                    position: 'relative',
                    /* 根据宽高比计算设置 box 的 padding-bottom */
                    paddingBottom: '50%',
                }}>
                <img
                    src={img}
                    ref={ref}
                    data-src="flur"
                    style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                    }}></img>
            </div>
        </>
    );
};
