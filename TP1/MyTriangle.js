/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate of the first point
 * @param y1 - y coordinate of the first point
 * @param z1 - z coordinate of the first point
 * @param x2 - x coordinate of the second point
 * @param y2 - y coordinate of the second point
 * @param z2 - z coordinate of the second point
 * @param x3 - x coordinate of the third point
 * @param y3 - y coordinate of the third point
 * @param z3 - z coordinate of the third point
 */
class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		super(scene);
		
		this.x1 = x1;
		this.y1 = y1;
		this.z1 = z1;

		this.x2 = x2;
		this.y2 = y2;
		this.z2 = z2;

		this.x3 = x3;
		this.y3 = y3;
		this.z3 = z3;

		this.initBuffers();
	}

	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y2, this.z2,	//1
			this.x3, this.y3, this.z3,	//2

			this.x1, this.y1, this.z1,	//3
			this.x2, this.y2, this.z2,	//4
			this.x3, this.y3, this.z3	//5
		]

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			2, 1, 0,
		];

		//Vectorial product to find the normal vector to the plane
		let nx = (this.y2 - this.y1) * (this.z3 - this.z1) - (this.z2 - this.z1) * (this.y3 - this.y1);
		let ny = -(this.x2 - this.x1) * (this.z3 - this.z1) + (this.z2 - this.z1) * (this.x3 - this.x1);
		let nz = (this.x2 - this.x1) * (this.y3 - this.y1) - (this.y2 - this.y1) * (this.x3 - this.x1);

		this.normals = [
			nx, ny, nz,
			nx, ny, nz,
			nx, ny, nz,

			-nx, -ny, -nz,
			-nx, -ny, -nz,
			-nx, -ny, -nz,
		];
		
		// length of the sides of the triangle
		this.a = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2) + Math.pow(this.z2 - this.z1, 2));
		this.b = Math.sqrt(Math.pow(this.x3 - this.x2, 2) + Math.pow(this.y3 - this.y2, 2) + Math.pow(this.z3 - this.z2, 2));
    	this.c = Math.sqrt(Math.pow(this.x1 - this.x3, 2) + Math.pow(this.y1 - this.y3, 2) + Math.pow(this.z1 - this.z3, 2));
		
		// law of cosines
    	this.cos_alpha = (Math.pow(this.a,2) - Math.pow(this.b,2) + Math.pow(this.c,2))/(2*this.a*this.c);
    	this.sin_alpha = Math.sqrt(1 - Math.pow(this.cos_alpha, 2));

		this.texCoords = [
			0, 0,
			this.a, 0,
			this.c*this.cos_alpha, this.c*this.sin_alpha,

			0, 0,
			this.a, 0,
			this.c*this.cos_alpha, this.c*this.sin_alpha
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	updateTexCoords(length_s, length_t) {
		this.texCoords = [
			0, 0,
			this.a/length_s, 0,
			this.c*this.cos_alpha/length_s, this.c*this.sin_alpha/length_t,

			0, 0,
			this.a/length_s, 0,
			this.c*this.cos_alpha/length_s, this.c*this.sin_alpha/length_t
		];
		this.updateTexCoordsGLBuffers();
	}
}
