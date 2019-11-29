#ifdef GL_ES
precision highp float;
#endif

uniform float timeFactor;
uniform float scaleFactor;
uniform float colorFactor;
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

/**
 *	Function that adds the horizontal lines to the security camera
 */
vec4 addHorizontalLines(vec4 color) {
	//Divide the screen in horizontal lines:
	//	- scaleFactor is used to change the number of lines in the screen
	//	- timeFactor is used to animate the camera
	if(mod(vTextureCoord.y*scaleFactor+timeFactor, 2.0) > 1.0){
		//Half of the lines will be lighter
		//	- colorFactor is used to change the color of the line
		//		- when colorFactor is 1.0, the line is equal to the original color
		//		- a colorFactor greater than 1.0 makes the line lighter than the original color
		color = vec4(color.rgb*colorFactor, 1.0);
	}

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