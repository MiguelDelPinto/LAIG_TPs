/**
 * MyLakeWater
 */
class MyLakeWater extends CGFobject {

    constructor(scene){
        super(scene);
        
        this.texture = new CGFtexture(this.scene, 'scenes/images/water.jpg');

        this.material = new CGFappearance(scene);
        this.material.setAmbient(0.2, 0.2, 0.2, 1);
        this.material.setDiffuse(0.6, 0.6, 0.6, 1);
        this.material.setSpecular(0.1, 0.1, 0.1, 1);
        this.material.setShininess(1.0);
        this.material.setTexture(this.texture);
        this.material.setTextureWrap('REPEAT', 'REPEAT'); 

        this.plane = new MyPlane(this.scene, 15, 15);
       
        this.initShaders();
    }

    /** 
     *  Initializes the shaders for the security camera
     */
     initShaders(){
        this.shader = new CGFshader(
            this.scene.gl,
            "shaders/water.vert",
            "shaders/water.frag"
        );
        
        this.timeFactor = 0;

        this.shader.setUniformsValues({timeFactor: 0});
        this.shader.setUniformsValues({texture: 0});
    }

    /**
     * Update function that is called every frame
     * @param {number} t Number of milisseconds since the last update 
     */
    update(t){
        this.timeFactor += t;
        this.shader.setUniformsValues({timeFactor: this.timeFactor});
    }

    /**
     * Display function: enables the security camera shader, binds the rendered
     * texture and displays the rectangle in the bottom right corner of the screen
     */
    display(){
        this.scene.setActiveShader(this.shader);
            this.material.apply();
            this.texture.bind(0);
            this.plane.display();
            this.texture.unbind(0);
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}