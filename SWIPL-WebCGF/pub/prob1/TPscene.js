
class TPscene extends CGFscene{
    constructor() {
        super();
    }
    init(application) {
        super.init(application);
        this.initCameras();
        this.initLights();
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.axis = new CGFaxis(this);
        this.obj = new MyObject(this);
    }
    initLights() {
        this.lights[0].setPosition(15, 2, 5, 1);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();
    }
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    display() {
        // ---- BEGIN Background, camera and axis setup
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();
        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();
        // Draw axis
        this.axis.display();
        this.setDefaultAppearance();
        // ---- END Background, camera and axis setup
        // ---- BEGIN Geometric transformation section
        // NOTE: OpenGL transformation matrices are transposed
        // Translate (5, 0, 2)
        var tra = [1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            5.0, 0.0, 2.0, 1.0];
        // Rotate 30 degrees around Y
        // These constants would normally be pre-computed at initialization time
        // they are placed here just to simplify the example
        var deg2rad = Math.PI / 180.0;
        var a_rad = 30.0 * deg2rad;
        var cos_a = Math.cos(a_rad);
        var sin_a = Math.sin(a_rad);
        var rot = [cos_a, 0.0, -sin_a, 0.0,
            0.0, 1.0, 0.0, 0.0,
            sin_a, 0.0, cos_a, 0.0,
            0.0, 0.0, 0.0, 1.0];
        // Scaling by (5,2,1)
        var sca = [5.0, 0.0, 0.0, 0.0,
            0.0, 2.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0];
        // Multiplication of the previous transformations
        //this.multMatrix(tra);     // GT = GT * tra
        //this.multMatrix(rot);     // GT = GT * rot
        //this.multMatrix(sca);     // GT = GT * sca
        // ---- END Geometric transformation section
        // ---- BEGIN Primitive drawing section
        this.obj.display();
        // ---- END Primitive drawing section
    }
}






