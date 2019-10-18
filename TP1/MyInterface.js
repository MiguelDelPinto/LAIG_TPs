/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    loadInterface(graphLights) {
        this.loadLightsOption(graphLights);
        this.loadCamerasOption();
    }

    loadCamerasOption() {
        const cameras = this.scene.cameras;

        this.gui.add(this.scene, 'current_camera_index', this.scene.cameraNames)
                     .name('Camera')
                     .onChange(this.scene.updateCamera.bind(this.scene));
    }

    loadLightsOption(graphLights) {
        var folder = this.gui.addFolder('Lights');

        // Lights index.
        let i = 0;
        // Reads the lights from the scene graph.
        for(let key in graphLights){
            if(i >= 8)
                break;
            
            if(graphLights.hasOwnProperty(key)){
                folder.add(graphLights[key], '0')
                .name('Ligth_'+(i+1));
      
                i++;
            }
        }
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}