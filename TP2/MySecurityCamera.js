/**
 * MySecurityCamera
 */
class MySecurityCamera {
    constructor(scene, textureRTT){
        this.scene = scene;
        this.textureRTT = textureRTT;

        this.rectangle = new MyRectangle(this.scene, -1, 0.5, 1, -0.5, -1);
        this.initShaders();
    }

    initShaders(){
        this.shader = new CGFshader(
            this.scene.gl,
            "shaders/securityCamera.vert",
            "shaders/securityCamera.frag"
        );
        
        this.shader.setUniformsValues({timeFactor: 0});
    }

    display(){
        this.scene.setActiveShader(this.shader);
            this.textureRTT.bind(0);
        
            this.rectangle.display();

        this.scene.setActiveShader(this.scene.defaultShader);
    }
}