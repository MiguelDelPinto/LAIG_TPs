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
        
        // Variable for enabling/disabling the axis in the interface
        this.displayAxis = true;

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

        // Variable for camera changing in the interface
        this.current_camera_id = 0;

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);
    }

    /**
     * Initializes WebGL's default camera.
     * Will only be used if the default camera in the XML is not working
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
                this.lights[i].setConstantAttenuation(light[6][0]);
                this.lights[i].setLinearAttenuation(light[6][1]);
                this.lights[i].setQuadraticAttenuation(light[6][2]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[7]);
                    this.lights[i].setSpotExponent(light[8]);
                    this.lights[i].setSpotDirection(light[9][0] - light[2][0], light[9][1] - light[2][1], light[9][2] - light[2][2]);
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

    /**
     * Sets the default appearance for the scene
     */
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    /**
     * Loads the cameras defined in the XML
     * Only after the default camera is created
     */
    loadCameras() {
        this.cameraNames = [];
        this.cameras = [];

        // Sets the current camera's id to the default camera's id
        this.current_camera_id = this.graph.default_view;

        // Reads the views from the scene graph
        for (let key in this.graph.views) {
            if (this.graph.views.hasOwnProperty(key)) {
                
                // Loads a view from the scene graph
                let current_view = this.graph.views[key];

                // Variable where the current camera will be stored
                let current_camera;

                if(current_view[1] === "perspective") {
                    current_camera = new CGFcamera(current_view[4],   //fov
                                                   current_view[2],   //near
                                                   current_view[3],   //far
                                                   current_view[5],   //position
                                                   current_view[6]);  //target
                }
                else if(current_view[1] === "ortho") {
                    current_camera = new CGFcameraOrtho(current_view[4],   //left
                                                        current_view[5],   //right
                                                        current_view[7],   //bottom
                                                        current_view[6],   //top 
                                                        current_view[2],   //near
                                                        current_view[3],   //far
                                                        current_view[8],   //position
                                                        current_view[9],   //target
                                                        current_view[10]);  //up
                }

                // stores the unique name of the camera (id)
                this.cameraNames.push(current_view[0]);

                // stores the camera in a dictionary, where the key is its id
                this.cameras[current_view[0]] = current_camera;
            }
        }

        // Sets the current camera as the default camera parsed in the XML
        let current_camera = this.cameras[this.current_camera_id];

        // In case of a camera being corrupted, goes to the default camera
        this.camera = current_camera || this.default_camera;
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Updates the camera when a new one is selected on the interface
     */
    updateCamera() {
        // Uses the interface variable, current_camera_id, to know which camera to choose
        let selected_camera = this.cameras[this.current_camera_id];

        // If it isn't working, chooses the default camera
        this.camera = selected_camera || this.default_camera;

        this.interface.setActiveCamera(this.camera);
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

        // Enables/disables the axis according to the interface
        if(this.displayAxis)
            this.axis.display();


        if (this.sceneInited) {
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
     * Checks if the 'M' key was pressed 
     */
    checkKeys(){
        if(this.interface.isKeyPressed('KeyM')){
            this.graph.increaseMCount();
        }
    }

    /**
     * Updates the lights when they are enabled/disabled in the interface 
     */
    updateLights(){
        const graphLights = this.graph.getLights();
        // Lights index.
        let i = 0;

        // Reads the lights from the scene graph.
        for(let key in graphLights){
            if(i >= 8)
                break;
            
            if(graphLights.hasOwnProperty(key)){
                let light = graphLights[key];
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