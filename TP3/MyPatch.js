/**
 * MyPatch
 * @constructor
 * @param scene - Reference to MyScene object
 * @param npointsU - Number of points in the U direction (that is, the degree in U plus one)
 * @param npointsV - Number of points in the V direction (that is, the degree in V plus one)
 * @param npartsU - Number of divisions in the U direction
 * @param npartsV - Number of divisions in the V direction
 * @param controlPoints - Control points for the NURBS surface, all in a row
 */
class MyPatch extends CGFobject {
	constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints) {
		super(scene);

		this.npointsU = npointsU;
		this.npointsV = npointsV;
		this.npartsU = npartsU;
		this.npartsV = npartsV;
		
		this.controlPoints = controlPoints;

		this.generate();
	}
	
	generate() {

		// This class receives the control points all in a row, in single vector, so it
		// needs to assemble them correctly, thaking in count the degrees of U and V
		let controlVertexes = [];
		for(let i = 0; i < this.npointsU; i++) {

			let uPoint = [];
			for(let j = 0; j < this.npointsV; j++) {

				uPoint.push(this.controlPoints[i*this.npointsV + j]);
			}

			controlVertexes.push(uPoint);
		}

		// Creates a NURBS surface
		let nurbsSurface = new CGFnurbsSurface(this.npointsU-1, this.npointsV-1, controlVertexes);

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

