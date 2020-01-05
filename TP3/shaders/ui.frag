#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D texture;

varying vec2 vTextureCoord;
uniform float player;

vec4 getPLayerColor(){
	if(player == 1.0){
		return vec4(0.125, 0.5, 0.5, 0.0);
	}else if(player == 2.0){
		return vec4(0.5, 0.5, 0.125, 0.0);
	}

	return vec4(0.6, 0.6, 0.6, 1.0);
}

void main() {

	vec4 playerColor = getPLayerColor();

	gl_FragColor = texture2D(texture, vTextureCoord)+playerColor;
}