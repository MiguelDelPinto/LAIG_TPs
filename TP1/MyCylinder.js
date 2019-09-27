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
        var currentHeight = 0, nextHeight = 0;
        var currentRadius = 0, nextRadius = 0;
        
        var center = [(this.top+this.top+this.base)/3, this.height/3];
        var hyp_center = [(this.top+this.base)/2, this.height/2];
        var normal_direction = [hyp_center[0] - center[0], hyp_center[1] - center[1]];

        for(var stack = 0; stack < this.stacks; stack++){
            ang = 0;
            currentHeight = stackHeight*stack;
            nextHeight = stackHeight*(stack+1);
            currentRadius = this.base + currentHeight*(this.top-this.base)/this.height;
            nextRadius = this.base + nextHeight*(this.top-this.base)/this.height;

            for(var slice = 0; slice < this.slices; slice++){

                this.vertices.push(Math.cos(ang)*currentRadius, currentHeight, -Math.sin(ang)*currentRadius);
                this.vertices.push(Math.cos(ang)*currentRadius, nextHeight, -Math.sin(ang)*currentRadius);         
                this.vertices.push(Math.cos(ang+alphaAng)*nextRadius, currentHeight, -Math.sin(ang+alphaAng)*nextRadius);
                this.vertices.push(Math.cos(ang+alphaAng)*nextRadius, nextHeight, -Math.sin(ang+alphaAng)*nextRadius);

                this.indices.push(4*slice + 4*this.slices*stack, (4*slice + 4*this.slices*stack +3) % (4*this.slices*this.stacks), (4*slice+ 4*this.slices*stack +1)%(4*this.slices*this.stacks));
                this.indices.push(4*slice + 4*this.slices*stack, (4*slice + 4*this.slices*stack +2) % (4*this.slices*this.stacks), (4*slice+ 4*this.slices*stack +3)%(4*this.slices*this.stacks));


                this.normals.push(Math.cos(ang)*normal_direction[0],  normal_direction[1], -Math.sin(ang)*normal_direction[0]);
                this.normals.push(Math.cos(ang)*normal_direction[0], normal_direction[1], -Math.sin(ang)*normal_direction[0]);
                this.normals.push(Math.cos(ang+alphaAng)*normal_direction[0], normal_direction[1], -Math.sin(ang+alphaAng)*normal_direction[0]);
                this.normals.push(Math.cos(ang+alphaAng)*normal_direction[0], normal_direction[1], -Math.sin(ang+alphaAng)*normal_direction[0]);

                /*if(this.wrap){
                    this.texCoords.push(i/this.slices, 1);
                    this.texCoords.push(i/this.slices, 0);
                    this.texCoords.push((i+1)/this.slices, 1);
                    this.texCoords.push((i+1)/this.slices, 0);
                }   
                else{
                    this.texCoords.push(0, 1);
                    this.texCoords.push(0, 0);
                    this.texCoords.push(1, 1);
                    this.texCoords.push(1, 0);
                }*/

                ang+=alphaAng;   
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