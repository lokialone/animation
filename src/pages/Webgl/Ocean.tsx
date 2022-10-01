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

    return (
        <>
            <main>
                <div data-scroll>
                    <div className="page">
                        <header>
                            <h1>Oceans</h1>
                            <img src="img/header.jpg" alt="" />
                        </header>
                        <div>以下图片鼠标移动图片出现动画</div>
                        <div className="grid">
                            <a className="item item_v">
                                <div className="item__image">
                                    <img src="img/1.jpg" alt="" />
                                    {/* <div className="item__meta">December 23, 2020</div> */}
                                </div>

                                {/* <h2 className="item__title">Octopus punches fish in the head (just because it can)</h2> */}
                                {/* <p>
                                    Octopuses sometimes partner with fish to hunt, but the partnership comes with risks
                                    (for the fish, that is).
                                </p> */}
                            </a>
                            <a className="item item_h">
                                <div className="item__image">
                                    <img src="img/2.jpg" alt="" />
                                    {/* <div className="item__meta">December 01, 2020</div> */}
                                </div>

                                {/* <h2 className="item__title">
                                    Newfound marine blob looks like 'party balloon' with two strings, scientists say
                                </h2>
                                <p>
                                    This is the first species NOAA scientists have ever discovered from video footage
                                    alone.
                                </p> */}
                            </a>
                            <a className="item item_h">
                                <div className="item__image">
                                    <img src="img/4.jpg" alt="" />
                                    {/* <div className="item__meta">November 26, 2020</div> */}
                                </div>

                                {/* <h2 className="item__title">Swarm of eels breaks record</h2> */}
                                {/* <p>
                                    Before we start mining for precious metals in the darkness of the deep sea, we might
                                    try switching on the light first and observing our surroundings.
                                </p> */}
                            </a>
                            <a className="item item_v">
                                <div className="item__image">
                                    <img src="img/3.jpg" alt="" />
                                    {/* <div className="item__meta">November 03, 2020</div> */}
                                </div>

                                {/* <h2 className="item__title">Mantis shrimp punch down</h2> */}
                                {/* <p>Home-stealers fought the hardest for smaller-than-ideal dens.</p> */}
                            </a>
                            <a className="item item_v">
                                <div className="item__image">
                                    <img src="img/1.jpg" alt="" />
                                    {/* <div className="item__meta">October 05, 2020</div> */}
                                </div>

                                {/* <h2 className="item__title">Megalodon's hugeness</h2> */}
                                {/* <p>Even among its extinct relatives, Megalodon was unequalled in length and mass.</p> */}
                            </a>
                            <a className="item item_h">
                                <div className="item__image">
                                    <img src="img/2.jpg" alt="" />
                                    {/* <div className="item__meta">July 27, 2020</div> */}
                                </div>

                                {/* <h2 className="item__title">Adorable sunfish</h2> */}
                                {/* <p>Sunfish in the Molidae family are among the biggest fish in the world.</p> */}
                            </a>
                            <a className="item item_h">
                                <div className="item__image">
                                    <img src="img/4.jpg" alt="" />
                                    {/* <div className="item__meta">August 18, 2020</div> */}
                                </div>

                                {/* <h2 className="item__title">Massive 'Darth Vader' sea bug</h2> */}
                                {/* <p>The newly described species is one of the biggest isopods known to science.</p> */}
                            </a>
                            <a className="item item_v">
                                <div className="item__image">
                                    <img src="img/3.jpg" alt="" />
                                    {/* <div className="item__meta">June 01, 2020</div> */}
                                </div>

                                {/* <h2 className="item__title">Scientists capture the world's deepest octopus</h2> */}
                                {/* <p>The octopus was found miles beneath the ocean surface.</p> */}
                            </a>
                        </div>
                        <footer className="footer">
                            <p>
                                &copy; all news from <a href="https://www.livescience.com/topics/ocean">LiveScience</a>
                            </p>
                            <p>
                                {/* This page was made for{' '} */}
                                {/* <a href="https://www.awwwards.com/academy/course/merging-webgl-and-html-worlds">
                                    Merging WebGL and HTML course on Awwwards.com
                                </a> */}
                                <br />
                                Wish you a good day! =)
                            </p>
                        </footer>
                    </div>
                </div>
            </main>
            <div ref={ref} className="webgl-ocean"></div>
        </>
    );
};

export default OceanPage;
