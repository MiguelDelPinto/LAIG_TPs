/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param radius - Radius of the Sphere
 * @param slices - Slices of the Sphere
 * @param stacks - Stacks of the Sphere
 */
class MyTorus extends CGFobject {
    constructor(scene, inner_radius, outer_radius, slices, loops) {
        super(scene);
        this.inner = inner_radius;
        this.outer = outer_radius;
        this.slices = slices;
        this.loops = loops;
        
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

		// Calculates the increment for the phi angle
        let phi = 2*Math.PI/this.slices;    //0 to 360 degrees

        // Calculates the increment for the theta angle
        let theta = 2*Math.PI/this.loops;    //0 to 360 degrees  
  
		for(let slice = 0; slice <= this.slices; slice++) {
			// Auxiliar variable to reduce some calculations of the slice
			let slice_coefs = [Math.cos(phi*slice), Math.sin(phi*slice)];
			
			for(let loop = 0; loop <= this.loops; loop++) {
				// Auxiliar variable to reduce some calculations of the loop
				let loop_coefs = [Math.cos(theta*loop), Math.sin(theta*loop)];
	
				// Adds the vertices, the normals and the texture coordinates 
				this.vertices.push(slice_coefs[0] * (this.outer + this.inner*loop_coefs[0]), 
								   slice_coefs[1] * (this.outer + this.inner*loop_coefs[0]), 
								   loop_coefs[1] * this.inner);

				this.normals.push(loop_coefs[0] * slice_coefs[0], 
							      loop_coefs[0] * slice_coefs[1],
								  loop_coefs[1]);

				this.texCoords.push(slice/this.slices, 1-loop/this.loops);								 
			}
		}

        // Adds indices to MyTorus  
		for (let slice = 0; slice < this.slices; slice++) {
			for(let loop = 0; loop < this.loops; loop++) {
				// The first triangle has the top left vertex and the both bottom vertices 
                // The second triangle has the both up vertices and the bottom right vertex 
				this.indices.push(
					(slice+1)*(this.loops+1) + loop, slice*(this.loops+1) + loop+1, slice*(this.loops+1) + loop,
					slice*(this.loops+1) + loop+1, (slice+1)*(this.loops+1) + loop, (slice+1)*(this.loops+1) + loop+1
				);
			}
		}	

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

     updateTexCoords(length_s, length_t) {}
}