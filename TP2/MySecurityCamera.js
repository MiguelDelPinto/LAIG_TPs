/**
 * MySecurityCamera
 */
class MySecurityCamera {
    constructor(scene, textureRTT){
        this.scene = scene;
        this.textureRTT = textureRTT;

        this.rectangle = new MyRectangle(this.scene, -1, 0.5, 1, -1, -0.5);
       
        this.initShaders();
    }

    initShaders(){
        this.shader = new CGFshader(
            this.scene.gl,
            "shaders/securityCamera.vert",
            "shaders/securityCamera.frag"
        );
        
        this.timeFactor = 0;
        this.speed = 15.0;

        this.shader.setUniformsValues({timeFactor: 0});
        this.shader.setUniformsValues({texture: 0});
        this.shader.setUniformsValues({scaleFactor: 100.0});
        this.shader.setUniformsValues({colorFactor: 1.5});
    }

    update(t){
        this.timeFactor += t;
        const speedFactor = this.speed*0.001;
        let shaderValue = this.timeFactor*speedFactor;
        this.shader.setUniformsValues({timeFactor: shaderValue});
    }

    updateScaleFactor(newScaleFactor){
        this.shader.setUniformsValues({scaleFactor: newScaleFactor});
    }

    updateSpeed(newSpeed){
        this.speed = newSpeed;
    }

    updateColorFactor(newColorFactor){
        this.shader.setUniformsValues({colorFactor: newColorFactor})
    }

    display(){
        this.scene.setActiveShader(this.shader);
            this.textureRTT.bind(0);
        
            this.rectangle.display();

        this.scene.setActiveShader(this.scene.defaultShader);
    }
}