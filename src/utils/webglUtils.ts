import {stringify} from 'querystring';

export function resizeCanvas(canvas: HTMLCanvasElement) {
    const realToCSSPixels = window.devicePixelRatio;
    const displayWidth = Math.floor(canvas.clientWidth * realToCSSPixels);
    const displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);
    if (canvas.width != displayWidth || canvas.height != displayHeight) {
        // 设置为相同的尺寸
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}

// 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
export function createShader(
    gl: WebGLRenderingContext,
    type: WebGLRenderingContext['FRAGMENT_SHADER'] | WebGLRenderingContext['VERTEX_SHADER'],
    source: string,
) {
    const shader = gl.createShader(type); // 创建着色器对象
    if (!shader) return;
    gl.shaderSource(shader, source); // 提供数据源
    gl.compileShader(shader); // 编译 -> 生成着色器
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

export function createProgramFromScripts(
    gl: WebGLRenderingContext,
    vertextShaderString: string,
    fragmentShaderString: string,
) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertextShaderString);
    if (!vertexShader) return;
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderString);
    if (!fragmentShader) return;
    return createProgram(gl, vertexShader, fragmentShader);
}

export function randomInt(range: number) {
    return Math.floor(Math.random() * range);
}

export function setGeometry(gl: WebGLRenderingContext) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, -100, 150, 125, -175, 100]), gl.STATIC_DRAW);
}
