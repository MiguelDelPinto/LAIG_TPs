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

		this.patch1 = new MyPatch(this.scene, 2, 4, this.slices, this.stacks, control_points_1);
		this.patch2 = new MyPatch(this.scene, 2, 4, this.slices, this.stacks, control_points_2);

		/*
		ALTERNATIVE WAY:
		
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