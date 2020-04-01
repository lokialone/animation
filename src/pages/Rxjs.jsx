import React, {useRef, useEffect} from 'react';

class Observable {
    constructor(forEach) {
        this._forEach = forEach;
    }
    forEach(onNext, onError, onComplete) {
        if (typeof onNext === 'function') {
            return this._forEach({
                onNext,
                onError: onError,
                onComplete: onComplete
            });
        } else {
            return this._forEach(onNext);
        }
    }
    map(projectFunction){
        return new Observable((observer) => {
            return this.forEach(
                (x) => observer.onNext(projectFunction(x),
                (e) => observer.onError(e),
                () => observer.onCompleted(),
            ))
        })

    }
    take(num) {
        return new Observable((observer) => {
            let counter = 0;
            let subscription = this.forEach(
                (x) => {
                    observer.onNext(x);
                    counter++;
                    if (counter === num) {
                        subscription.dispose();
                    }
                },
                (e) => observer.onError(e),
                () => observer.onCompleted(),
            );
            return subscription;
        })
    }
    filter(testFunction){
        return new Observable((observer) => {
            return this.forEach(
               (x) => {
                    if (testFunction(x)) {
                        observer.onNext(x);
                    }
                },
                (e) => observer.onError(e),
                () => observer.onCompleted(),
            );
        })

    }
    static fromEvent (dom,eventName) {
        return new Observable ((observer) => {
            const handler = (e) => {
                observer.onNext(e);
            };
            dom.addEventListener(eventName, handler);
            return {
                dispose: function () {
                    dom.removeEventListener(eventName, handler);
                },
            };
        });
    }
};

const Home = (props) => {
    const ref = useRef(null);
    useEffect(() => {
        let clicks = Observable.fromEvent(ref.current, 'click').take(2).map(e => e.pageX + 20).filter(e => e>25);
        clicks.forEach(e => {
            console.log('click', e);
        })
    }, []);
    return <div ref={ref}>rxjsffff</div>;
};

export default Home;
