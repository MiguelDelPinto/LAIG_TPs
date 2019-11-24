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

        this.generate();
    }
    	
	generate() {		

		// Generates the control points for the first half-cylinder, calculated with
		// De Casteljau's algorithm
		let control_points_1 = 
		[
				[-this.base, 0, 0, 1],
				[-this.base, this.base*4/3, 0, 1],
				[this.base, this.base*4/3, 0, 1],
				[this.base, 0, 0, 1],

				[-this.top, 0, this.height, 1],
				[-this.top, this.top*4/3, this.height, 1],
				[this.top, this.top*4/3, this.height, 1],
				[this.top, 0, this.height, 1]
		]

		// Generates the control points for the second half-cylinder, calculated with
		// De Casteljau's algorithm
		let control_points_2 =
        [
                [this.base, 0, 0, 1],
                [this.base, -this.base*4/3, 0, 1],
                [-this.base, -this.base*4/3, 0, 1],
				[-this.base, 0, 0, 1],
				
                [this.top, 0, this.height, 1],
                [this.top, -this.top*4/3, this.height, 1],
                [-this.top, -this.top*4/3, this.height, 1],
                [-this.top, 0, this.height, 1]
        ];

		// Creates the first half-cylinder
		this.patch1 = new MyPatch(this.scene, 2, 4, this.slices, this.stacks, control_points_1);

		// Created the second half-cylinder
		this.patch2 = new MyPatch(this.scene, 2, 4, this.slices, this.stacks, control_points_2);

		/*
		An alternative way of creating this primitive, by using only one surface
		and changing the value of the 'w' coordinate in the corners, so that
		if forms a perfect circle:
		
		let smooth_curve = Math.sqrt(2)/2;

		let control_points = 
		[
			[
				[0, -this.base, 0, 1],
				[-this.base, -this.base, 0, smooth_curve],

				[-this.base, 0, 0, 1],
				[-this.base, this.base, 0, smooth_curve],

				[0, this.base, 0, 1],
				[this.base, this.base, 0, smooth_curve],

				[this.base, 0, 0, 1],
				[this.base, -this.base, 0, smooth_curve],

				[0, -this.base, 0, 1],
			],
			[
				[0, -this.top, this.height, 1],
				[-this.top, -this.top, this.height, smooth_curve],

				[-this.top, 0, this.height, 1],
				[-this.top, this.top, this.height, smooth_curve],

				[0, this.top, this.height, 1],
				[this.top, this.top, this.height, smooth_curve],

				[this.top, 0, this.height, 1],
				[this.top, -this.top, this.height, smooth_curve],

				[0, -this.top, this.height, 1],
			]
		];
		
		let nurbsSurface = new CGFnurbsSurface(1, 8, control_points);
		this.nurbsObject = new CGFnurbsObject(this.scene, this.slices, this.stacks, nurbsSurface);
		*/

	}

	display() {
		this.patch1.display();
		this.patch2.display();
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