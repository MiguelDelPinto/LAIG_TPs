/**
* MyCylinder
* @constructor
* @param scene - Reference to MyScene object
* @param base_radius - Radius of the base
* @param top_radius - Radius of the top
* @param height - Height of the cylinder
* @param slice - Number of slices
* @param staks - Number of stacks
*/
class MyCylinder extends CGFobject {
    constructor(scene, base_radius, top_radius, height, slices, stacks) {
        super(scene);
        
        this.base = base_radius;
        this.top = top_radius;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // Auxiliar variable that represents the alpha angle in each point
        let ang = 0;

        // Calculates the increment for the alpha angle (around the z axis)
        let alphaAng = 2*Math.PI/this.slices;

        // Calculates the stack height
        let stackHeight = this.height/this.stacks;

        // Stack height in each stack 
        let currentHeight = 0;

        // Useful when we have different radius in the base and the top 
        let currentRadius = 0;

        let nz = Math.atan(stackHeight/this.base); 

        for(let stack = 0; stack <= this.stacks; stack++){
            ang = 0; //Resets the ang variable

            // Calculates the height and radius of each stack
            currentHeight = stackHeight*stack;
            currentRadius = this.base + currentHeight*(this.top-this.base)/this.height;

            for(let slice = 0; slice <= this.slices; slice++){
                // Adds the vertices, the normals and the texture coordinates
                this.vertices.push(-Math.sin(ang)*currentRadius, Math.cos(ang)*currentRadius,  currentHeight);
                this.normals.push(-Math.sin(ang), Math.cos(ang), nz);
                this.texCoords.push(slice/this.slices, 1-stack/this.stacks);

                // Increments the ang variable by the alpha angle
                ang+=alphaAng;   
            }
        }
        
        // Adds indices to MyCylinder  
        for(let stack = 0; stack < this.stacks; stack++){
            for(let slice = 0; slice < this.slices; slice++){   
                let index = (stack * (this.slices + 1)) + slice;
                
                // The first triangle has the bottom left vertex and the both top vertices 
                this.indices.push(index, index + this.slices + 2, index + this.slices + 1);
                // The second triangle has the both bottom vertices and the top right vertex 
                this.indices.push(index, index + 1, index + this.slices + 2);
            }
        }
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    updateBuffers(complexity){
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }

     updateTexCoords(length_s, length_t) {}
}