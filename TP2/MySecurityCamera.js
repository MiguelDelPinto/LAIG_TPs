/**
 * MySecurityCamera
 */
class MySecurityCamera {
    /**
     * Creates MySecurityCamera class: creates a rectangle and initializes the shaders
     * @param {CGFscene} scene 
     * @param {CGFtextureRTT} textureRTT 
     */
    constructor(scene, textureRTT){
        this.scene = scene;
        this.textureRTT = textureRTT;

        this.rectangle = new MyRectangle(this.scene, -1, 0.5, 1, -1, -0.5);
       
        this.initShaders();
    }

    /** 
     *  Initializes the shaders for the security camera
     */
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

    /**
     * Update function that is called every frame
     * @param {number} t Number of milisseconds since the last update 
     */
    update(t){
        this.timeFactor += t;
        const speedFactor = this.speed*0.001;
        let shaderValue = this.timeFactor*speedFactor;
        this.shader.setUniformsValues({timeFactor: shaderValue});
    }

    /**
     * Updates the scale factor from the security camera shader 
     * @param {number} newScaleFactor Number of horizontal lines of the security camera
     */
    updateScaleFactor(newScaleFactor){
        this.shader.setUniformsValues({scaleFactor: newScaleFactor});
    }

    /**
     * Updates the speed from the security camera shader
     * @param {number} newSpeed Speed of the security camera animation
     */
    updateSpeed(newSpeed){
        this.speed = newSpeed;
    }

    /**
     * Updates the color factor from the security camera shader
     * @param {number} newColorFactor Color factor: 1.0 means that the 
     * color of the horizontal lines will be equal to the rest; a color 
     * factor greater than 1.0 makes the horizontal lines lighter than 
     * the original color
     */
    updateColorFactor(newColorFactor){
        this.shader.setUniformsValues({colorFactor: newColorFactor})
    }

    /**
     * Display function: enables the security camera shader, binds the rendered
     * texture and displays the rectangle in the bottom right corner of the screen
     */
    display(){
        this.scene.setActiveShader(this.shader);
            this.textureRTT.bind(0);
        
            this.rectangle.display();

            this.textureRTT.unbind(0);
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}