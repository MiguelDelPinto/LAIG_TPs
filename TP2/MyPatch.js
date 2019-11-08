/**
 * MyPatch
 * @constructor
 * @param scene - Reference to MyScene object
 * @param degreeU - Surface degree in the U direction
 * @param degreeV - Surface degree in the V direction
 */
class MyPatch extends CGFobject {
	constructor(scene, id, degreeU, degreeV) {
		super(scene);
		this.degreeU = degreeU;
		this.degreeV = degreeV;

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

