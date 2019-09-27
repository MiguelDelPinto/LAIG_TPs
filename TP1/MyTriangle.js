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
		let n1 = (this.y2 - this.y1) * (this.z3 - this.z1) - (this.z2 - this.z1) * (this.y3 - this.y1);
		let n2 = -(this.x2 - this.x1) * (this.z3 - this.z1) + (this.z2 - this.z1) * (this.x3 - this.x1);
		let n3 = (this.x2 - this.x1) * (this.y3 - this.y1) - (this.y2 - this.y1) * (this.x3 - this.x1);

		this.normals = [
			n1, n2, n3,
			n1, n2, n3,
			n1, n2, n3,

			-n1, -n2, -n3,
			-n1, -n2, -n3,
			-n1, -n2, -n3,
		];

		//REVIEW THE TEX COORDS LATER
		this.texCoords = [
			0, 1,
			0.5, 1,
			0, 0.5,

			0, 1,
			0.5, 1,
			0, 0.5,
		]

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}
