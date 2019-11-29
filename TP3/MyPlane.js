/**
 * MyPlane
 * @constructor
 * @param scene - Reference to MyScene object
 * @param npartsU - Number of divisions in the U direction
 * @param npartsV - Number of divisions in the V direction
 */
class MyPlane extends CGFobject {
	constructor(scene, npartsU, npartsV) {
		super(scene);

		this.npartsU = npartsU;
		this.npartsV = npartsV;

		this.generate();
	}
	
	generate() {

		// Creates the control points so that the plane is in the XZ plane,
		// with its surface pointing in the positive Y direction
		// and has size 1x1
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
		];

		// Creates a NURBS surface
		let nurbsSurface = new CGFnurbsSurface(1, 1, controlVertexes);

		// And finally, creates a NURBS object, using the nurbs surface
		this.nurbsObject = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface);
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

