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


        for(var stack = 0; stack < this.stacks; stack++){
            ang = 0;
            currentHeight = stackHeight*stack;
            nextHeight = stackHeight*(stack+1);
            currentRadius = this.base + currentHeight*(this.top-this.base)/this.height;
            nextRadius = this.base + nextHeight*(this.top-this.base)/this.height;

            for(var slice = 0; slice < this.slices; slice++){

                this.vertices.push(-Math.sin(ang)*currentRadius, Math.cos(ang)*currentRadius,  currentHeight);
                this.vertices.push(-Math.sin(ang)*nextRadius, Math.cos(ang)*nextRadius,  nextHeight);         
                this.vertices.push(-Math.sin(ang+alphaAng)*currentRadius, Math.cos(ang+alphaAng)*currentRadius, currentHeight);
                this.vertices.push(-Math.sin(ang+alphaAng)*nextRadius, Math.cos(ang+alphaAng)*nextRadius,  nextHeight);

                this.indices.push(4*slice + 4*this.slices*stack, (4*slice + 4*this.slices*stack +3) % (4*this.slices*this.stacks), (4*slice+ 4*this.slices*stack +1)%(4*this.slices*this.stacks));
                this.indices.push(4*slice + 4*this.slices*stack, (4*slice + 4*this.slices*stack +2) % (4*this.slices*this.stacks), (4*slice+ 4*this.slices*stack +3)%(4*this.slices*this.stacks));


                this.normals.push(-Math.sin(ang), Math.cos(ang), 0);
                this.normals.push(-Math.sin(ang),Math.cos(ang), 0);
                this.normals.push(-Math.sin(ang+alphaAng), Math.cos(ang+alphaAng),0);
                this.normals.push(-Math.sin(ang+alphaAng), Math.cos(ang+alphaAng), 0);

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