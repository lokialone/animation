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
        attribute vec2 a_texCoord;
        
        uniform vec2 u_resolution;
        
        varying vec2 v_texCoord;
        
        void main() {
           // convert the rectangle from pixels to 0.0 to 1.0
           vec2 zeroToOne = a_position / u_resolution;
        
           // convert from 0->1 to 0->2
           vec2 zeroToTwo = zeroToOne * 2.0;
        
           // convert from 0->2 to -1->+1 (clipspace)
           vec2 clipSpace = zeroToTwo - 1.0;
        
           gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        
           // pass the texCoord to the fragment shader
           // The GPU will interpolate this value between points.
           v_texCoord = a_texCoord;
        }
        `;
        const fragmentShaderSource = `
            precision mediump float;

            // our texture
            uniform sampler2D u_image;
            
            // the texCoords passed in from the vertex shader.
            varying vec2 v_texCoord;
            
            void main() {
            gl_FragColor = texture2D(u_image, v_texCoord);
            }
        `;
        const program = createProgramFromScripts(gl, vertexShaderSource, fragmentShaderSource);
        if (!program) return;
        const image = new Image();
        image.src = '/01.jpeg';
        function setRectangle(gl: WebGLRenderingContext, x: number, y: number, width: number, height: number): void {
            const x1 = x;
            const x2 = x + width;
            const y1 = y;
            const y2 = y + height;
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
                gl.STATIC_DRAW,
            );
        }
        function createScene(gl: WebGLRenderingContext, program: WebGLProgram): void {
            //设置画布大小
            resizeCanvas(gl.canvas as HTMLCanvasElement);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(program);
            const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
            gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
        }

        function initVertex(gl: WebGLRenderingContext, attributeName: string, program: WebGLProgram) {
            const positionLocation = gl.getAttribLocation(program, attributeName);
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            setRectangle(gl, 0, 0, image.width, image.height);
            gl.enableVertexAttribArray(positionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            return 3;
        }
        function initTextCoordVertex(gl: WebGLRenderingContext, attributeName: string, program: WebGLProgram) {
            const texcoordLocation = gl.getAttribLocation(program, attributeName);
            // provide texture coordinates for the rectangle.
            const texcoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
                gl.STATIC_DRAW,
            );
            // Create a texture.
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);

            // Set the parameters so we can render any size image.
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            // Upload the image into the texture.
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            // Turn on the texcoord attribute
            gl.enableVertexAttribArray(texcoordLocation);

            // bind the texcoord buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
            gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
        }
        image.onload = () => {
            // look up where the vertex data needs to go.
            createScene(gl, program);
            initVertex(gl, 'a_position', program);
            initTextCoordVertex(gl, 'a_texCoord', program);
            const primitiveType = gl.TRIANGLES;
            gl.drawArrays(primitiveType, 0, 6);
        };
    }, []);
    return (
        <div>
            <canvas ref={canvas} width="800" height="600"></canvas>
        </div>
    );
};

export default Home;
