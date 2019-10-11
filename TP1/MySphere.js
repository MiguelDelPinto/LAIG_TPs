/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param radius - Radius of the Sphere
 * @param slices - Slices of the Sphere
 * @param stacks - Stacks of the Sphere
 */
class MySphere extends CGFobject {
    constructor(scene, id, radius, slices, stacks) {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;
        this.id = id;
        
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let phi = 2*Math.PI/this.slices;    //0 to 360 degrees
        let theta = 2*Math.PI/this.stacks;    //0 to 180 degrees  
        
        for(let stack = 0; stack <= this.stacks; stack++) {
            for(let slice = 0; slice <= this.slices; slice++) {
                
                let x = Math.cos(theta * slice) * Math.cos(phi * stack);
                let y = Math.cos(theta * slice) * Math.sin(phi * stack);
                let z = Math.sin(theta * slice);

                this.vertices.push(this.radius * x, this.radius * y, this.radius * z);
                this.normals.push(x, y, z);
                this.texCoords.push(1 - (slice / this.slices), 1 - (stack / this.stacks));
              
                if(stack != this.stacks && slice != this.slices) {
                    var index = (stack * (this.slices + 1)) + slice;

                    this.indices.push(index, index + this.slices + 2, index + this.slices + 1);
                    this.indices.push(index, index + 1, index + this.slices + 2);
                }
            }
        }   

        this.auxTexCoords = this.texCoords;

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateTexCoords(length_s, length_t) {

        for(let i = 0; i < auxTexCoords; i++){
            texCoords[i] = auxTexCoords[i] / length_s;
            i++;
            texCoords[i] = auxTexCoords[i] / length_t;
        }
		
		this.updateTexCoordsGLBuffers();
	}
}