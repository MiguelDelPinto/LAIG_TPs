/**
 * MyPlane
 * @constructor
 * @param scene - Reference to MyScene object
 * @param divisionsU - Number of divisions in the U direction
 * @param divisionsV - Number of divisions in the V direction
 */
class MyPlane extends CGFobject {
	constructor(scene, id, divisionsU, divisionsV) {
		super(scene);
		this.divisionsU = divisionsU;
		this.divisionsV = divisionsV;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [];

		//Counter-clockwise reference of vertices
		this.indices = [];

		//Facing Y positive
		this.normals = [];
		
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		this.texCoords = [];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param length_s Length in the s direction
     * @param length_t Length in the t direction
	 */
	updateTexCoords(length_s, length_t) {
	}
}

