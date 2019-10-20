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

        let phi_increment = 2*Math.PI/this.slices;
        let theta_increment = Math.PI/(2*this.stacks);

        let theta_offset = Math.PI/2;
        
        for(let stack = 0; stack <= 2*this.stacks; stack++) {
            let theta = theta_offset - theta_increment * stack; // goes from 90 degrees to -90 degrees

            for(let slice = 0; slice <= this.slices; slice++) {
                let phi = phi_increment * slice; //goes from 0 degrees to 360 degrees
                
                let x = Math.cos(theta) * Math.cos(phi);
                let y = Math.cos(theta) * Math.sin(phi);
                let z = Math.sin(theta);

                this.vertices.push(this.radius * x, this.radius * y, this.radius * z);
                
                this.normals.push(x, y, z);

                this.texCoords.push(slice / this.slices, 1 - stack / (2 * this.stacks));
              
                if(stack != 2*this.stacks && slice != this.slices) {
                    let index = stack * (this.slices + 1) + slice;

                    this.indices.push(index + 1, index, index + this.slices + 1);
                    this.indices.push(index + this.slices + 2, index + 1, index + this.slices + 1);
                }
            }
        }   

        this.auxTexCoords = this.texCoords;

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateTexCoords(length_s, length_t) {}
}