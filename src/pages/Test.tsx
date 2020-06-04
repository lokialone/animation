import React, {useEffect, useRef, useState, useCallback} from 'react';
interface Props {
    path?: string;
}

type pathMeta = [string, string, number];
type to = [string, number];
interface Paths {
    [key: string]: to[];
}
const Test = (props: Props) => {
    /** Search base infos */
    useEffect(() => {
        const data: pathMeta[] = [
            ['A', 'B', 3],
            ['A', 'C', 2],
            ['A', 'D', 6],
            ['B', 'D', 4],
            ['C', 'E', 4],
            ['D', 'E', 2],
            ['D', 'F', 3],
            ['E', 'F', 1],
        ];
        function createPath(data: pathMeta[]): Paths {
            return data.reduce((acc: Paths, current: pathMeta) => {
                const from = current[0];
                const to = current[1];
                const len = current[2];
                if (!acc[from]) acc[from] = [];
                if (!acc[to]) acc[to] = [];
                if (acc[from]) {
                    acc[from].push([to, len]);
                    acc[to].push([from, len]);
                }
                return acc;
            }, {});
        }

        const graph = createPath(data);
        function visit(from: string, to: string, route: string[] = []): any {
            const nexts = graph[from];
            if (from === to) {
                route.push(from);
                console.log('达到', route);
                return;
            }
            for (let i = 0; i < nexts.length; i++) {
                const newRoute = [...route];
                newRoute.push(from);
                const path = nexts[i];
                const next = path[0];
                if (newRoute.includes(next)) {
                    continue;
                }
                visit(next, to, newRoute);
            }
            return;
        }
        visit('A', 'F');

        // function addPath([]) {}
    }, []);
    /** Search info action */

    return <></>;
};

export default Test;
