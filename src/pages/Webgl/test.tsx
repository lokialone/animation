import React, {useRef, useEffect} from 'react';
import {resizeCanvas, createProgramFromScripts} from '../../utils/webglUtils';
declare global {
    interface Window {
        m3: {
            translate: Function;
            projection: Function;
            rotate: Function;
            scale: Function;
        };
        webglLessonsUI: {
            setupSlider: Function;
        };
    }
}
const Home = (props: {path: string}) => {
    const canvas = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvas.current) return;
        const gl = canvas.current.getContext('webgl');
        if (!gl) return;

        const vertexShaderSource = `
        attribute vec2 a_position;
        attribute vec4 a_color;
        uniform mat3 u_matrix; 
        varying vec4 v_color;
        
        void main() {
          // Multiply the position by the matrix.
          gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
        
          // Convert from clipspace to colorspace.
          // Clipspace goes -1.0 to +1.0
          // Colorspace goes from 0.0 to 1.0
          //   v_color = gl_Position * 0.5 + 0.5;
            v_color = a_color;
        }
        `;
        const fragmentShaderSource = `
            // 片断着色器没有默认精度，所以我们需要设置一个精度
            // mediump是一个不错的默认值，代表“medium precision”（中等精度）
            precision mediump float;
            varying vec4 v_color;
            void main() {
                // gl_FragColor是一个片断着色器主要设置的变量
            gl_FragColor = v_color;
        }`;
        const program = createProgramFromScripts(gl, vertexShaderSource, fragmentShaderSource);
        if (!program) return;
        const positionLocation = gl.getAttribLocation(program, 'a_position');
        //basic
        // const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        // gl.enableVertexAttribArray(positionAttributeLocation);
        // gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
        // Create a buffer.
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        setGeometry(gl);
        const translation = [200, 150];
        let angleInRadians = 0;
        const scale = [1, 1];
        const matrixLocation = gl.getUniformLocation(program, 'u_matrix');
        const colorLocation = gl.getAttribLocation(program, 'a_color');
        // Create a buffer for the colors.
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        setColors(gl);
        function setGeometry(gl: WebGLRenderingContext) {
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array([-150, -100, 150, -100, -150, 100, 150, -100, -150, 100, 150, 100]),
                gl.STATIC_DRAW,
            );
        }
        function setColors(gl: WebGLRenderingContext) {
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array([
                    Math.random(),
                    Math.random(),
                    Math.random(),
                    1,
                    Math.random(),
                    Math.random(),
                    Math.random(),
                    1,
                    Math.random(),
                    Math.random(),
                    Math.random(),
                    1,
                    Math.random(),
                    Math.random(),
                    Math.random(),
                    1,
                    Math.random(),
                    Math.random(),
                    Math.random(),
                    1,
                    Math.random(),
                    Math.random(),
                    Math.random(),
                    1,
                ]),
                gl.STATIC_DRAW,
            );
        }
        function drawScene() {
            if (!gl || !program) return;
            resizeCanvas(gl.canvas as HTMLCanvasElement);

            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            // Clear the canvas.
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Tell it to use our program (pair of shaders)
            gl.useProgram(program);

            // Turn on the attribute
            gl.enableVertexAttribArray(positionLocation);

            // Bind the position buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
            const size = 2; // 2 components per iteration
            const type = gl.FLOAT; // the data is 32bit floats
            const normalize = false; // don't normalize the data
            const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
            const offset = 0; // start at the beginning of the buffer
            gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

            gl.enableVertexAttribArray(colorLocation);

            // Bind the color buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

            // start at the beginning of the buffer
            gl.vertexAttribPointer(colorLocation, 4, type, normalize, stride, offset);

            // Compute the matrix
            const canvas = gl.canvas as HTMLCanvasElement;
            let matrix = window.m3.projection(canvas.clientWidth, canvas.clientHeight);
            matrix = window.m3.translate(matrix, translation[0], translation[1]);
            matrix = window.m3.rotate(matrix, angleInRadians);
            matrix = window.m3.scale(matrix, scale[0], scale[1]);

            // Set the matrix.
            gl.uniformMatrix3fv(matrixLocation, false, matrix);

            const count = 6;
            gl.drawArrays(gl.TRIANGLES, 0, count);
        }
        function updatePosition(index: number) {
            return function (event: any, ui: any) {
                translation[index] = ui.value;
                drawScene();
            };
        }

        function updateAngle(event: any, ui: any) {
            const angleInDegrees = 360 - ui.value;
            angleInRadians = (angleInDegrees * Math.PI) / 180;
            drawScene();
        }

        function updateScale(index: number) {
            return function (event: any, ui: any) {
                scale[index] = ui.value;
                drawScene();
            };
        }
        //basic
        // lookup uniforms
        setGeometry(gl);
        setColors(gl);
        drawScene();
        // Setup a ui.
        window.webglLessonsUI.setupSlider('#x', {
            value: translation[0],
            slide: updatePosition(0),
            max: gl.canvas.width,
        });
        window.webglLessonsUI.setupSlider('#y', {
            value: translation[1],
            slide: updatePosition(1),
            max: gl.canvas.height,
        });
        window.webglLessonsUI.setupSlider('#angle', {slide: updateAngle, max: 360});
        window.webglLessonsUI.setupSlider('#scaleX', {
            value: scale[0],
            slide: updateScale(0),
            min: -5,
            max: 5,
            step: 0.01,
            precision: 2,
        });
        window.webglLessonsUI.setupSlider('#scaleY', {
            value: scale[1],
            slide: updateScale(1),
            min: -5,
            max: 5,
            step: 0.01,
            precision: 2,
        });

        // return () => {};
        // Returns a random integer from 0 to range - 1.
    }, []);
    return (
        <div>
            <canvas ref={canvas} width="800" height="600"></canvas>
        </div>
    );
};

export default Home;
