/**
 * MyPlane
 * @constructor
 * @param scene - Reference to MyScene object
 * @param divisionsU - Number of divisions in the U direction
 * @param divisionsV - Number of divisions in the V direction
 */
class MyPlane extends CGFobject {
	constructor(scene, id, npartsU, npartsV) {
		super(scene);

		this.npartsU = npartsU;
		this.npartsV = npartsV;

		this.generate();
	}
	
	generate() {
		let controlVertexes = 
		[
			[
				[-0.5, 0, 0.5, 1],
				[-0.5, 0, -0.5, 1]
			],
			[
				[0.5, 0, 0.5, 1],
				[0.5, 0, -0.5, 1]
			]
		]

		let nurbsSurface = new CGFNurbsSurface(1, 1, controlVertexes);

		this.nurbsObject = new CGFNurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface);
	}

	display() {
		this.nurbsObject.display();
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

