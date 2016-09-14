//author: Jacob Hackman
//date: 9/9/16
//description: A spinning block with keyboard controls or an alternative slider control featuring console output.
//proposed points (out of 15): 15. All elements of the assignment have been completed. 

//Controls are noted below, but are as follows. Note they only work when the slider is toggled "off", the default state.
//  W   ::  Faster (also "F")
//A-S-D ::  Direction-Slower-Direction
//  X   ::  Halt
// 

"use strict";
//Initialize variables for use.
var gl;
var theta = 0.0;
var speed = 0.1;
var thetaLoc;
var slider_val = 0.0;
var button = 0.0;
var direction = true;
var timesPressed = 0;

window.onload = function init() //Load window
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 ); 

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    //Establish colors & points for rotating square
    var colors = [
        vec3( 0.0, 0.0, 1.0),
        vec3( 0.0, 0.5, 0.5),
        vec3( 0.0, 0.5, 0.5),
        vec3( 1.0, 1.0, 1.0),
        ];

    var vertices = [
        vec2(  0,  1 ),
        vec2(  -1,  0 ),
        vec2( 1,  0 ),
        vec2(  0, -1 )
    ];


    // Load the data into the GPU

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation( program, "theta" );

    //Establish keypress activators. They use a "WASD" configuration, with X to stop. See comment on top.
    window.onkeydown = function( event ) {
    var key = String.fromCharCode(event.keyCode);
    switch( key ) {
      case 'D': //direction
      case 'd':
        if (button == 0) {direction = !direction;}
        break;
      case 'F':  //faster
      case 'f':
        if (button == 0) {speed += 0.05;}
       break;
      case 'W':  //faster
      case 'w':
        if (button == 0) {speed += 0.05;}
       break;
      case 'D': //direction
      case 'd':
        if (button == 0) {direction = !direction;}
        break;
      case 'A': //direction
      case 'a':
        if (button == 0) {direction = !direction;}
        break;
      case 'S':  //slower
      case 's':
        if (button == 0) {speed -= 0.05;}
        if (speed <= 0.0 && button == 0) {
            speed = 0.0;};
        break;
      case 'X':  //halt
      case 'x':
        if (button == 0) {speed = 0.0;}
        break;
        }
    console.log("Keypress attempted to change current speed. Current value:\n",speed) //Console will track speed upon keypress
    };

    //Initialize the menu controls, which are alternative elements for the keystrokes.
    document.getElementById("Controls" ).onclick = function(event) {
        switch( event.target.index ) {
          case 0:
            direction = !direction;
            break;
          case 1:
            speed += 0.05;
            break;
          case 2:
            speed -= 0.05;
            if (speed <= 0.0) {
                speed = 0.0;
            }   
            break;
       }
    };

    // Initialize event handler (button) - it will toggle the slider and buttons to be active or not.
    document.getElementById("apply").onclick = function () {
        if (button == 1){ //Value 1 activates the slider control
            button = 0;
            speed = 0;
        }
        else {
            button = 1; // Activates the slider and acitvates the slider's current value as the speed
            speed = slider_val;
        }
        console.debug("Toggled!");
        console.log("button active on 1:", button);
    };

    // Slider serves as an alternative method to control speed.
    document.getElementById("slider").onchange = function(event) {
    slider_val = parseFloat(event.target.value);
    if (button == 1) { // Slider val takes control if the button is pressed
        speed = slider_val;
        console.log("speed set at", speed*100, "%") // Logs the current percentage for slider
    }
    };


    render();
};


//Render the end result
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );

    if (direction == true)
    {
        theta += speed;
    }
    else 
    {
        theta -= speed;
    }
    gl.uniform1f(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    window.requestAnimFrame(render);
}