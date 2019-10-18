var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initDefaultCamera();

        //FOR TESTING
        this.current_camera_index = 0;

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);
    }

    /**
     * Initializes the scene cameras.
     */
    initDefaultCamera() {
        this.default_camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        this.camera = this.default_camera;
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        // Lights index.
        var i = 0;

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    this.lights[i].setSpotDirection(light[8][0], light[8][1], light[8][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    loadCameras() {
        this.cameraNames = [];
        this.cameras = [];

        // Views index.
        let camera_index = 0;
        let default_index = 0;  //for later

        // Reads the views from the scene graph
        for (let key in this.graph.views) {
            if (this.graph.views.hasOwnProperty(key)) {
                
                // Load a view from the scene graph
                let current_view = this.graph.views[key];

                // Variable where the current camera will be stored
                let current_camera; //CHANGE TO CONST?

                if(current_view[0] === "perspective") {
                    current_camera = new CGFcamera(current_view[3],   //fov
                                                   current_view[1],   //near
                                                   current_view[2],   //far
                                                   current_view[4],   //position
                                                   current_view[5]);  //target
                }
                else if(current_view[0] === "ortho") {
                    current_camera = new CGFcameraOrtho(current_view[3],   //left
                                                        current_view[4],   //right
                                                        current_view[6],   //bottom
                                                        current_view[5],   //top 
                                                        current_view[1],   //near
                                                        current_view[2],   //far
                                                        current_view[7],   //position
                                                        current_view[8],   //target
                                                        current_view[9]);  //up
                }
                console.log(camera_index);
                console.log(current_camera);
                console.log();
                this.cameraNames.push(camera_index);    //Maybe change?
                this.cameras.push(current_camera);
                //this.cameras[camera_index] = current_camera;

                camera_index++;
            }
        }

        let current_camera = this.cameras[0];   // 0 for now, needs to be the default one

        this.camera = current_camera || this.default_camera;
        this.interface.setActiveCamera(this.camera);
    }

    updateCamera() {
        let selected_camera = this.cameras[this.current_camera_index];

        this.camera = selected_camera || this.default_camera;
        this.interface.setActiveCamera(this.camera);
        console.log("OLA");
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);
        this.initLights();
        this.loadCameras();
        const graphLights = this.graph.getLights();
        this.interface.loadInterface(graphLights);

        this.sceneInited = true;
    }

    /**
     * Displays the scene.
     */
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
        
        this.pushMatrix();
        this.axis.display();


        if (this.sceneInited) {
            this.updateLights();
            
            // Draw axis
            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    /**
     * Update function that is called every frame
     * @param {number} t Number of milisseconds since the loading of the scene 
     */
    update(t){
        this.checkKeys();
    }

    /**
     * Check if the key M was pressed 
     */
    checkKeys(){
        if(this.interface.isKeyPressed('KeyM')){
            this.graph.increaseMCount();
        }
    }

    updateLights(){
        const graphLights = this.graph.getLights();
        console.log(graphLights);
        // Lights index.
        let i = 0;

        // Reads the lights from the scene graph.
        for(let key in graphLights){
            if(i >= 8)
                break;
            
            if(graphLights.hasOwnProperty(key)){
                let light = graphLights[key];
                console.log(key+" - "+ graphLights[key]+": "+light[0]);
                if(light[0])
                    this.lights[i].enable();
                else    
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
            else
                console.log(key);
        }
    }
}