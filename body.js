
class Body{

    x;
    y;
    vx;
    vy;
    mass;
    radius;
    precision;
    positionBuffer;
    id;
    color;

    constructor(m, x, y, vx, vy, radius, precision, id, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = m;
        this.radius = radius;
        this.precision = precision;
        this.id = id;
        this.color = color

        this.setPositionBuffers();
    }

    setPositionBuffers() {
        var deltaAngle = 2*Math.PI/this.precision;
        this.positionBuffer = new Array(6*this.precision);
        for(var i = 0; i < this.precision; i++){
            this.positionBuffer[6*i] = this.x;
            this.positionBuffer[6*i + 1] = this.y;
            this.positionBuffer[6*i + 2] = this.x + this.radius * Math.cos(i * deltaAngle);
            this.positionBuffer[6*i + 3] = this.y + this.radius * Math.sin(i * deltaAngle);
            this.positionBuffer[6*i + 4] = this.x + this.radius * Math.cos((i + 1) * deltaAngle);
            this.positionBuffer[6*i + 5] = this.y + this.radius * Math.sin((i + 1) * deltaAngle);
        }
    }

    computeNewton(bodies=Array, delta) {
        //Computing the Newton's force applying on the body according to the others
        //Receive the bodyList array from world -> the array with all the Bodies of the system
        //delta is used for the calculation w/ Euler method to integrate
        
        //Computing distances

        var distances = new Array(bodies.length); //the fact that disctances has the same length than bodies allow to select distance with the id of the body
        var differentBodies = new Array(bodies.length - 1); //Store the bodies that are != of this one
        var n = 0;
        for(var i = 0; i<bodies.length; i++){
            var b = bodies[i];
            if(b.id != this.id){
                distances[i] = Math.pow(
                    Math.pow((b.x - this.x), 2) + Math.pow((b.y - this.y), 2),   
                    1.5
                );
                differentBodies[n] = b;
                n++;
            }
        }

        //Computing force value
        var f = new Array(2); // for dx and dy
        f[0] = 0;
        f[1] = 0;
        for(var i = 0; i<bodies.length - 1; i++){
            var b = differentBodies[i];
            f[0] += - (b.mass*(this.x - b.x) / distances[b.id]);
            f[1] += - (b.mass*(this.y - b.y) / distances[b.id]);
        }
        
        //Resetting x and y according to the computed force
        var old_vx = this.vx;
        var old_vy = this.vy;

        this.vx = this.vx + delta * f[0];
        this.vy = this.vy + delta * f[1];
        this.x = this.x + delta * old_vx;
        this.y = this.y + delta * old_vy;

        //resetting the positionBuffer for display
        this.setPositionBuffers();
    }
}