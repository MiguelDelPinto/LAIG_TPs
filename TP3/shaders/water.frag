#ifdef GL_ES
precision highp float;
#endif

uniform float timeFactor;
uniform sampler2D texture;

varying vec2 vTextureCoord;

/**
 *	Function that adds the radial gradient to the security camera
 */
float getRadialValue(){
	//Getting x and y coordinates: maximum value in the center
	float x = 0.5-abs(vTextureCoord.x-0.5);
	float y = 0.5-abs(vTextureCoord.y-0.5);

	return (x+y)/2.0; 
}

void main() {
	//Getting radial value
	float radial_value = getRadialValue();

	//Getting color from textureRTT
	vec4 color = texture2D(texture, vTextureCoord+vec2(timeFactor*0.00001,timeFactor*0.00001));

	//Adding radial color
	color = vec4(color.rgb*radial_value, 1.0);

	gl_FragColor = color;
}