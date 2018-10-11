//======================================================================
// matrix.js
//======================================================================

// initiate an empty 1D array
// all positions set to 0.0
function Array1D(x){
	var arr = [];
	for (var i = 0; i < x; i++){
		arr.push(0.0);
	}
	return arr;
}//Array()

// initiate an empty 2D array
// all positions set to 0.0
function Array2D(x, y){
	var arr = new Array(x);
	for (var i = 0; i < x; i++){
		arr[i] = new Array(y);
		for (var k = 0; k < y; k++){
			arr[i][k] = 0.0;
		}
	}
	return arr;
}//Array2D()

function matmult(mat, vec1){
	var dimx = mat[0].length;
	var dimy = mat.length;
	var vec = vec1.length;
	var vec2 = new Array1D(dimy);

	for (var y = 0; y < dimy; y++){
		for (var x = 0; x < vec; x++){
			vec2[y] += mat[y][x] * vec1[x];
		}
	}
	return vec2;
}//matmult()

/*// vector class with its own variables
// stored for easy access and working with
function vector4D(x, y, z, w){
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
	this.length = 4;
	this.vec = [x, y, z, w];
}//vector4D

// convert a vector array to a 2D matrix
// where all vector information is stored
// on the y axis.
function vecToMatrix(vec){
	var mat = new Array2D(1, 4);
	mat[0][0] = vec.x;
	mat[0][1] = vec.y;
	mat[0][2] = vec.z;
	mat[0][3] = vec.w;
	return mat;
}//vecToMatrix()

// convert a matrix back to a vector class
// used as e vector
function matrixToVec(mat){
	var vec = new vector4D();
	vec.x = mat[0][0];
	vec.y = mat[0][1];
	if (mat.length > 2){
		vec.z = mat[0][2];}
	if (mat.length > 3){
		vec.w = mat[0][3];}
}//matrixToVec()*/

function rotationYZ(a){
	var sin = Math.sin(a);
	var cos = Math.cos(a);
	var rotYZ = [
		[1, 0, 0, 0],
		[0, cos, -sin, 0],
		[0, sin, cos, 0],
		[0, 0, 0, 1]];
	return rotYZ;
}//rotationYZ()

function rotationXZ(a){
	var sin = Math.sin(a);
	var cos = Math.cos(a);
	var rotXZ = [
		[cos, 0, sin, 0],
		[0, 1, 0, 0],
		[-sin, 0, cos, 0],
		[0, 0, 0, 1]];
	return rotXZ;
}//rotationXZ()

function rotationXY(a){
	var sin = Math.sin(a);
	var cos = Math.cos(a);
	var rotXY = [
		[cos, -sin, 0, 0],
		[sin, cos, 0, 0],
		[0, 0, 1, 0],
		[0, 0, 0, 1]];
	return rotXY;
}//rotationXY()

function rotationXW(a){
	var sin = Math.sin(a);
	var cos = Math.cos(a);
	var rotZW = [
		[cos, 0, 0, -sin],
		[0, 1, 0, 0],
		[0, 0, 1, 0],
		[sin, 0, 0, cos]];
	return rotZW;
}//rotationZW()

function rotationYW(a){
	var sin = Math.sin(a);
	var cos = Math.cos(a);
	var rotZW = [
		[1, 0, 0, 0],
		[0, cos, 0, -sin],
		[0, 0, 1, 0],
		[0, sin, 0, cos]];
	return rotZW;
}//rotationZW()

function rotationZW(a){
	var sin = Math.sin(a);
	var cos = Math.cos(a);
	var rotZW = [
		[1, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 0, cos, -sin],
		[0, 0, sin, cos]];
	return rotZW;
}//rotationZW()

function scaleMatrix(s){
	var scaleXYZW = [
		[s[0], 0, 0, 0],
		[0, s[1], 0, 0],
		[0, 0, s[2], 0],
		[0, 0, 0, s[3]]];
	return scaleXYZW;
}//scaleMatrix()
