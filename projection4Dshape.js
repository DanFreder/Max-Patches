//======================================================================
// projection4Dshape.js
// a hypercube projected in the third dimension
//
// written by Timo Hoogland © 2018
// based on processing code by Dan Shiffman of the Coding Train
// www.timohoogland.com
//======================================================================

include("matrix.js");

autowatch = 1;
inlets = 1;
outlets = 2;

// manual 2D-array of all vertices for
// 4D cube (a.k.a hypercube, tesseract)
var points = new Array2D(16, 4);
points[0] = [-1, -1, 1, 1];
points[1] = [1, -1, 1, 1];
points[2] = [1, 1, 1, 1];
points[3] = [-1, 1, 1, 1];
points[4] = [-1, -1, -1, 1];
points[5] = [1, -1, -1, 1];
points[6] = [1, 1, -1, 1];
points[7] = [-1, 1, -1, 1];
points[8] = [-1, -1, 1, -1];
points[9] = [1, -1, 1, -1];
points[10] = [1, 1, 1, -1];
points[11] = [-1, 1, 1, -1];
points[12] = [-1, -1, -1, -1];
points[13] = [1, -1, -1, -1];
points[14] = [1, 1, -1, -1];
points[15] = [-1, 1, -1, -1];

// initial jitter matrix for drawing vertices
// to a jit.gl.mesh outside the js object
var pointsMat = new JitterMatrix(3, "float32", points.length);
// initial jitter matrix for drawing lines
// we need 2 vertices per line, and have a total of 8 * 2 lines;
var linesMat = new JitterMatrix(3, "float32", points.length*4);

var TAU = Math.PI * 2.0;		// constant tau, 2 * pi
var isOrtho = false;			// boolean for ortho projection on/off
var is2D = false;				// boolean for 2D projection on/off
var scaleFactor = [1, 1, 1, 1];	// array with scale factors for xyzw
var distance = 3;				// distance for perspective projection
var lensAngle = 2;				// angle for perspective projection
var rotate = new Array1D(3);	// array with rotation values
var rotateW = new Array1D(3);	// array with rotation values

// the bang function is called on every framerender
// using the bang outlet from jit.world
function bang(){
	// var rotatedPoints;
	var rotatedPoints = new Array2D(points.length, 4);
	var projectedPoints = new Array2D(points.length, 4);

	// calculating points and drawing to jit.gl.mesh
	for (var i = 0; i < points.length; i++){
		rotatedPoints[i] = rotate4D(points[i]);
		projectedPoints[i] = projection4D(rotatedPoints[i]);
		pointsMat.setcell1d(i, projectedPoints[i]);
	}
	// filling matrix with vertices for drawing the lines
	var index = 0;
	for (var i = 0; i < points.length; i++){
		for (var k = i+1; k < points.length; k++){
			if (hypotenuse4D(points[i], points[k]) == 2){
				linesMat.setcell1d(index, pointsMat.getcell(i));
				linesMat.setcell1d(index+1, pointsMat.getcell(k));
				index += 2;
			}
		}
	}
	outlet(1, "jit_matrix", linesMat.name);
	outlet(0, "jit_matrix", pointsMat.name);
}//bang()

function rotate4D(vec){
	var rotated = vec;
	// rotate in 3D as usual
	rotated = matmult(scaleMatrix(scaleFactor), rotated);
	rotated = matmult(rotationYZ(rotate[0]), rotated);
	rotated = matmult(rotationXY(rotate[2]), rotated);
	rotated = matmult(rotationXZ(rotate[1]), rotated);
	// rotate in 4D
	rotated = matmult(rotationXW(rotateW[0]), rotated);
	rotated = matmult(rotationYW(rotateW[1]), rotated);
	rotated = matmult(rotationZW(rotateW[2]), rotated);
	return rotated;
}//rotate4D()

function projection4D(vec){
	var projected = vec;
	if (isOrtho){
		projected = matmult(orthoProjection, projected);
		if (is2D){
			projected = matmult(orthoProjection2D, projected);
		}
	} else {
		projected = matmult(perspectiveProj(distance, projected), projected);
		if (is2D){
			projected = matmult(perspectiveProj2D(distance, projected), projected);
		}
	}
	return projected;
}//projection4D()

function hypotenuse4D(vec4from, vec4to){
	if (vec4from.length == vec4to.length && vec4to.length == 4){
		var hypo = 0;
		for (var i = 0; i < 4; i++){
			hypo += Math.pow(vec4to[i] - vec4from[i], 2);
		}
		return Math.sqrt(hypo);
	} else {
		return -1;
	}
}//hypotenuse4D

//======================================================================
// PROJECTION MATRICES FUNCTIONS
//======================================================================

var far_clipping = 20;
var near_clipping = 1;

// a perspective projection matrix for
// proecting a 4D shape in the 3D domain
function perspectiveProj(d, vec){
	var w = lensAngle / (d - vec[3]);
	return persp = [
		[w, 0, 0, 0],
		[0, w, 0, 0],
		[0, 0, w, 0]
	];
}//perspectiveProj()

// a perspective projection matrix for
// projecting a 3D shape to 2D
function perspectiveProj2D(d, vec){
	var z = lensAngle / (d - vec[2]);
	return persp = [
		[z, 0, 0, 0],
		[0, z, 0, 0]];
}//perspectiveProj()

// a projection matrix for orthographic
// projection of a 4D shape to 3D
var orthoProjection = [
	[1, 0, 0, 0],
	[0, 1, 0, 0],
	[0, 0, 1, 0]
];

// a projection matrix for orthographic
// projection of a 3D shape to 2D
var orthoProjection2D = [
	[1, 0, 0, 0],
	[0, 1, 0, 0]
];

//======================================================================
// SET FUNCTIONS
//======================================================================

// set orthographic projection true or false
function ortho(v){
	isOrtho = Math.max(0, Math.min(1, v));
}

// set 2D projection true or false
function project2D(v){
	is2D = Math.max(0, Math.min(1, v));
}

function rotatexyz(x, y, z){
	rotate[0] = (x % 360.) / 360. * TAU;
	rotate[1] = (y % 360.) / 360. * TAU;
	rotate[2] = (z % 360.) / 360. * TAU;
}//rotatexyzw()

function rotate4Dxyz(x, y, z){
	rotateW[0] = (x % 360.) / 360. * TAU;
	rotateW[1] = (y % 360.) / 360. * TAU;
	rotateW[2] = (z % 360.) / 360. * TAU;
}//rotate4Dxyz()

function scale(x, y, z, w){
	scaleFactor = [x, y, z, w];
}//scale()

function setLensAngle(v){
	lensAngle = Math.max(0.1, v);
}//setFocalLength()

function setDistance(v){
	distance = v;
}//distance()

//======================================================================
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
//======================================================================
