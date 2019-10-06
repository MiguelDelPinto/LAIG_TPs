/**
* MyCylinder
* @constructor
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

        var ang = 0;
        var alphaAng = 2*Math.PI/this.slices;
        var stackHeight = this.height/this.stacks;
        var currentHeight = 0;
        var currentRadius = 0;

        for(var stack = 0; stack <= this.stacks; stack++){
            ang = 0;
            currentHeight = stackHeight*stack;
            currentRadius = this.base + currentHeight*(this.top-this.base)/this.height;

            for(var slice = 0; slice <= this.slices; slice++){
                this.vertices.push(-Math.sin(ang)*currentRadius, Math.cos(ang)*currentRadius,  currentHeight);
                this.normals.push(-Math.sin(ang), Math.cos(ang), 0);
                this.texCoords.push(slice/this.slices, 1-stack/this.stacks);
                ang+=alphaAng;   
            }
        }

        for(let stack = 0; stack < this.stacks; stack++){
            for(let slice = 0; slice < this.slices; slice++){   
                var index = (stack * (this.slices + 1)) + slice;

                this.indices.push(index, index + this.slices + 2, index + this.slices + 1);
                this.indices.push(index, index + 1, index + this.slices + 2);
            }
        }

        this.vertices.push(0, 0, 0);
        this.normals.push(0, -1, 0);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    updateBuffers(complexity){
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}