/**
 * MySecurityCamera
 */
class MySecurityCamera extends CGFobject {
    constructor(scene){
        super(scene);
        
        this.rectangle = new MyRectangle(this.scene, 0.75, 1, -0.75, -1);

        this.initBuffers();
        this.initShaders();
    }

    initShaders(){
        this.shader = new CGFshader(
            this.scene.gl,
            "shaders/securityCamera.vert",
            "shaders/securityCamera.frad"
        );
        
        this.shader.setUniformsValues({timeFactor: 0});
        this.shader.setUniformsValues({normScale: 1});
        this.shader.setUniformsValues({selColor: [1.0, 0.0, 0.0, 1.0]});
        
        this.scene.setActiveShader(this.shader);
    }

    initBuffers(){
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }

    display(){
        this.rectangle.display();
    }
}