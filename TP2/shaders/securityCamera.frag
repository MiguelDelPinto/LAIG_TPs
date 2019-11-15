#ifdef GL_ES
precision highp float;
#endif

uniform float timeFactor;
uniform sampler2D texture;

varying vec2 vTextureCoord;

void main() {
	vec4 color = texture2D(texture, vTextureCoord);
	gl_FragColor = color;
}