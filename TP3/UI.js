/**
 * UI
 */
class UI {
    constructor(scene){
        this.scene = scene;

        this.rectangle = new MyRectangle(this.scene, "ui", -1, -0.5, 0.75, 1);
       
        this.initShaders();
    }

    /** 
     *  Initializes the shaders for the UI
     */
     initShaders(){
        this.shader = new CGFshader(
            this.scene.gl,
            "shaders/ui.vert",
            "shaders/ui.frag"
        );
    }

    /**
     * Display function: enables the ui shader, binds the rendered
     * texture and displays the rectangle in the top left corner of the screen
     */
    display(){
        this.scene.setActiveShader(this.shader);

                this.rectangle.display();

        this.scene.setActiveShader(this.scene.defaultShader);
    }
}