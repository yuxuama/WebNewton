

function initWebGl(gl) {
    //Clearing
    clear(gl)

    //SHADERS
    const vsSource = document.querySelector("#vertex-shader-2d").textContent;
    const fsSource = document.querySelector("#fragment-shader-2d").textContent;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            aPosition: gl.getAttribLocation(shaderProgram, 'a_position')
        },
        uniformLocations: {
            uResolution: gl.getUniformLocation(shaderProgram, 'u_resolution'),
            uColor: gl.getUniformLocation(shaderProgram, 'u_color')
        } 
    };

    return programInfo;
}

function initShaderProgram(gl, vsource, fsource){
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsource)

    //Create ShaderProgram

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Impossible d'initialiser le programme !");
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source){
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Impossible de compiler les shaders !!");
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function clear(gl) {
    //Clear
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // effacement en noir, complètement opaque
    gl.clearDepth(1.0);                 // tout effacer
    gl.enable(gl.DEPTH_TEST);           // activer le test de profondeur
    gl.depthFunc(gl.LEQUAL); 
    //Clearing
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
}


function render(gl, programInfo, positions, color){
    //getting resolution
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(positions),
        gl.STATIC_DRAW
    );

    //setting program to use
    gl.useProgram(programInfo.program);

    //Setting vertex shader to pass correct attribute to it from our datas
    {    
           
        const nComponent = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(
            programInfo.attribLocations.aPosition,
            nComponent,
            type,
            normalize,
            stride,
            offset
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.aPosition
        ); 
    }

    // Setting the uniforms
    gl.uniform2f(programInfo.uniformLocations.uResolution, gl.canvas.width, gl.canvas.height);
    gl.uniform4f(programInfo.uniformLocations.uColor, color[0], color[1], color[2], 1.0);

    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const vertexCount = positions.length/2;
    gl.drawArrays(primitiveType, offset, vertexCount);
}