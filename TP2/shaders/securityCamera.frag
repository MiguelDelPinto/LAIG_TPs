#ifdef GL_ES
precision highp float;
#endif

uniform float timeFactor;
uniform sampler2D texture;

varying vec2 vTextureCoord;

float getRadialValue(){
	//Getting x and y coordinates: maximum value is the center
	float x = 0.5-abs(vTextureCoord.x-0.5);
	float y = 0.5-abs(vTextureCoord.y-0.5);

	//Creating a vec2 with the 2 values
	vec2 radial_coords = vec2(x, y);

	return length(radial_coords); //Returns the sqrt(x^2+y^2)
}

void main() {
	//Getting radial value
	float radial_value = getRadialValue();

	//Getting color from textureRTT
	vec4 color = texture2D(texture, vTextureCoord);

	gl_FragColor = vec4(color.rgb*radial_value, 1.0);
}