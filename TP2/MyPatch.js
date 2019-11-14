/**
 * MyPatch
 * @constructor
 * @param scene - Reference to MyScene object
 * @param degreeU - Surface degree in the U direction
 * @param degreeV - Surface degree in the V direction
 */
class MyPatch extends CGFobject {
	constructor(scene, id, npointsU, npointsV, npartsU, npartsV, controlPoints) {
		super(scene);

		this.npointsU = npointsU;
		this.npointsV = npointsV;
		this.npartsU = npartsU;
		this.npartsV = npartsV;
		
		this.controlPoints = controlPoints;

		this.generate();
	}
	
	// TODO add patch in parse primitives where control points are pushed in a single vector
	generate() {

		let controlVertexes = [];
		for(let i = 0; i < this.npointsU; i++) {

			let uPoint = [];
			for(let j = 0; j < this.npointsV; j++) {

				uPoint.push(this.controlPoints[i*nPointsV + j]);
			}

			controlVertexes.push(uPoint);
		}

		let nurbsSurface = new CGFNurbsSurface(this.npointsU-1, this.npointsV-1, controlVertexes); // -1?

		this.nurbsObject = newCGFNurbsObject(this.scene, this.npartsU-1, this.npartsV-1, nurbsSurface); // -1?
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

