
const precision = 10;
const radius = 20;

var bodies;
var gl;
var programInfo;
var beforeTime = 0;

var animating = false;
var reqID; 
var pausedTime = Date.now();
var animationSpeed = 100;

function init(){
    gl = document.querySelector("#glCanvas").getContext("webgl");
    programInfo = initWebGl(gl);
}

function clearAll(){
    bodies = null;
}

function createBodies(masses=Array, xs=Array, ys=Array, vxs=Array, vys=Array) {
    var nBody = masses.length;

    if(xs.length != nBody || ys.length != nBody || vxs.length != nBody || vys.length != nBody){
        alert("Wrong parameters (Wrong size array detected)");
        return;
    }

    bodies = new Array(nBody);
    
    for(n = 0; n < nBody; n++){
        createBody(masses[n], xs[n], ys[n], vxs[n], vys[n], n);
    }

    renderBodies();
}

function createBody(mass, x, y, vx, vy, n){
    var color = [Math.random(), Math.random(), Math.random(), 1.0];
    bodies[n] = new Body(mass, x, y, vx, vy, radius, precision, n, color);
}

function renderBodies(){
    clear(gl);
    for(n = 0; n<bodies.length; n++){
        render(gl, programInfo, bodies[n].positionBuffer, bodies[n].color)
    }
}


function animateBodies(now){
    now *= 0.001 * animationSpeed;
    var delta = now - beforeTime;
    beforeTime = now;

    if(animating){
        for(n = 0; n<bodies.length;n++){
            bodies[n].computeNewton(bodies, delta);
        }
        renderBodies();
        reqID = requestAnimationFrame(animateBodies); 
    }
    
    
}

function resetTimeAnimation(){
    beforeTime = beforeTime + (Date.now()-pausedTime) * 0.001 * animationSpeed;
}

function changeAnimating(){
    animating = !animating;
    if(!animating){
        pausedTime = Date.now()
    }
}

function isAnimating(){
    return animating;
}

function getReqID(){
    return reqID;
}

function getAnimSpeed(){
    return animationSpeed;
}

function setAnimSpeed(value){
    animationSpeed = value;
}
    