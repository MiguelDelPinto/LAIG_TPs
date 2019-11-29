/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
class MyObject extends CGFobject{
	constructor(scene) {
		super(scene);
		this.initBuffers();
	}
	initBuffers() {
		this.vertices = [
			-0.5, -0.5, 0,
			0.5, -0.5, 0,
			-0.5, 0.5, 0,
			0.5, 0.5, 0
		];
		this.indices = [
			0, 1, 2,
			3, 2, 1
		];
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}

