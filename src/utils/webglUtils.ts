export function resizeCanvas(canvas: HTMLCanvasElement) {
    const realToCSSPixels = window.devicePixelRatio;
    let displayWidth = Math.floor(canvas.clientWidth * realToCSSPixels);
    let displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);
    canvas.width = displayWidth;
    canvas.height = displayHeight
}


// 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
export function createShader(gl: WebGLRenderingContext , type: WebGLRenderingContext['FRAGMENT_SHADER'] |  WebGLRenderingContext['VERTEX_SHADER'], source: string) {
    let shader = gl.createShader(type); // 创建着色器对象
    if (!shader) return;
    gl.shaderSource(shader, source); // 提供数据源
    gl.compileShader(shader); // 编译 -> 生成着色器
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
   
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

export function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    let program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
   
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }
  