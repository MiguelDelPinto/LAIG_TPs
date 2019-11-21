#ifdef GL_ES
precision highp float;
#endif

uniform float timeFactor;
uniform float scaleFactor;
uniform sampler2D texture;

varying vec2 vTextureCoord;

float getRadialValue(){
	//Getting x and y coordinates: maximum value in the center
	float x = 0.5-abs(vTextureCoord.x-0.5);
	float y = 0.5-abs(vTextureCoord.y-0.5);

	return (x+y)/2.0; 
}

vec4 addHorizontalLines(vec4 color) {
	if(mod(vTextureCoord.y*scaleFactor+timeFactor, 2.0) > 1.0)
		color = vec4(color.rgb*1.5, 1.0);

	return color;
}

void main() {
	//Getting radial value
	float radial_value = getRadialValue();

	//Getting color from textureRTT
	vec4 color = texture2D(texture, vTextureCoord);

	//Adding radial color
	color = vec4(color.rgb*radial_value, 1.0);

	//Adding horizontal stripes
	color = addHorizontalLines(color);

	gl_FragColor = color;
}