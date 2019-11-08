/**
* MyCylinder2
* @constructor
* @param scene - Reference to MyScene object
* @param base_radius - Radius of the base
* @param top_radius - Radius of the top
* @param height - Height of the cylinder
* @param slice - Number of slices
* @param staks - Number of stacks
*/
class MyCylinder2 extends CGFobject {
    constructor(scene, base_radius, top_radius, height, slices, stacks) {
        super(scene);
        
        this.base = base_radius;
        this.top = top_radius;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

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