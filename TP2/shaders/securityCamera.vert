attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float timeFactor;
uniform float scaleFactor;
uniform float colorFactor;
uniform sampler2D texture;

varying vec2 vTextureCoord;

void main() {
	
	gl_Position = vec4(aVertexPosition, 1.0);

	vTextureCoord = vec2(aTextureCoord.s, 1.0-aTextureCoord.t);
}
