import {useRef, useEffect} from 'react';
import {Observable} from 'rxjs';
export function useConst<T>(initialValue: T | (() => T)): T {
    const ref = useRef<{value: T}>();
    if (ref.current === undefined) {
        ref.current = {
            value: typeof initialValue === 'function' ? (initialValue as Function)() : initialValue,
        };
    }
    return ref.current.value;
}

export function useObservable<T>(observable: Observable<T>, setter: (value: any) => void): void {
    useEffect(() => {
        const data = observable.subscribe((value: any) => setter(value));
        return (): void => {
            data.unsubscribe();
        };
    }, [observable, setter]);
}
