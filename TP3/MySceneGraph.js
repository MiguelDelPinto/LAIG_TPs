var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var GLOBALS_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        // Initizalizes the id of the roof element to null. Will be changed when parsing the XML
        this.idRoot = null;                    

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);


        /**
         * Variable used to count the number of clicks in the M key
         * It's used to change the material applied to the objects
         */
        this.clickM = 0;
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <globals>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != GLOBALS_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse globals block
            if ((error = this.parseGlobals(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }
        
        // <animations>
        if((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else{
            if(index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");
            
            //Parse animations block
            if((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        //Gets the default view's id
        this.default_view = this.reader.getString(viewsNode, 'default');

        let children = viewsNode.children;

        this.views = [];
        let numViews = 0;

        // Any number of views
        for (let i = 0; i < children.length; i++) {

            // Stores the views' information
            let global = [];
            let specs = [];
            let attributeNames = [];
            let attributeTypes = [];

            // Checks the type of view
            if (children[i].nodeName != "perspective" && children[i].nodeName != "ortho") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else
                attributeNames.push(...["from", "to"]);

            // Gets the id of the current view
            let viewId = this.reader.getString(children[i], 'id');
            if (viewId == null)
                return "no ID defined for view";

            // Checks for repeated ids
            if (this.views[viewId] != null)
                return "ID must be unique for each view (conflict: ID = " + viewId + ")";

            // Gets the 'near' component
            let near = this.reader.getFloat(children[i], 'near');
            if (!(near != null && !isNaN(near)))
                return "unable to parse the 'near' component of the view for ID = " + viewId;
               
            // Gets the 'far' component
            let far = this.reader.getFloat(children[i], 'far');           
            if (!(far != null && !isNaN(far)))
                return "unable to parse the 'far' component of the view for ID = " + viewId;

            // Checks if the 'near' component is bigger than the 'far' component
            if(near > far)
                return "the near component is bigger than the far component of the view for ID = " + viewId;

            global.push(viewId);
            global.push(children[i].nodeName);
            global.push(near);
            global.push(far);

            let grandChildren = children[i].children;

            // Parses the specifications for the current view
            let nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }            

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    let aux = this.parseCoordinates3D(grandChildren[attributeIndex], "position for ID" + viewId);

                    if (!Array.isArray(aux))
                        return aux;

                    specs.push(aux);
                }
                else
                    return "view " + attributeNames[i] + " undefined for ID = " + viewId;
            }

            // Get the missing attribute of the perspective view...
            if(children[i].nodeName == "perspective") {
                let angle = this.reader.getFloat(children[i], 'angle');
                if(!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the view for ID = " + viewId;
                angle = this.degreeToRad(angle);
                global.push(angle);
            }
                         
            // ...Or gets the additional attributes of the ortho view
            if (children[i].nodeName == "ortho") {
                let left = this.reader.getFloat(children[i], 'left');
                if (!(left != null && !isNaN(left)))
                    return "unable to parse 'left' component of the view for ID = " + viewId;
                
                let right = this.reader.getFloat(children[i], 'right');
                if (!(right != null && !isNaN(right)))
                    return "unable to parse 'right' component of the view for ID = " + viewId;

                let top = this.reader.getFloat(children[i], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse 'top' component of the view for ID = " + viewId;

                let bottom = this.reader.getFloat(children[i], 'bottom');
                if (!(bottom != null && !isNaN(bottom)))
                    return "unable to parse 'bottom' component of the view for ID = " + viewId;

                global.push(left);
                global.push(right);
                global.push(top);
                global.push(bottom);

                let upIndex = nodeNames.indexOf("up");

                //Retrieves the view's 'up' component
                let up = [0, 1, 0]; //Default up component, given that it's an optional parameter
                if (upIndex != -1) {
                    let aux = this.parseCoordinates3D(grandChildren[upIndex], "up view fo ID " + viewId);
                    if (!Array.isArray(aux))
                        return aux;

                    up = aux;
                }

                specs.push(up);
            }
            
            global.push(...specs);

            // Stores the view in a dictionary, with the key being its id
            this.views[viewId] = global;
            numViews++;

        }        
        
        if (numViews == 0)
            return "at least one view must be defined";

        this.log("Parsed views");
        return null;
    }

    /**
     * Parses the <globals> node.
     * @param {globals block element} globalsNode
     */
    parseGlobals(globalsNode) {

        var children = globalsNode.children;

        // Storage of information
        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        // Gets all of the parameter names
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        // Checks if the ambient parameter is missing
        var ambientIndex = nodeNames.indexOf("ambient");
        if(ambientIndex == -1)
            return "globals ambient parameter is undefined";

        // Checks if the background parameter is missing
        var backgroundIndex = nodeNames.indexOf("background");
        if(backgroundIndex == -1)
            return "globals ambient parameter is undefined";        

        // Gets the color specifications for the ambient parameter and checks them
        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return "globals -> " + color;
        else
            this.ambient = color;

        // Gets the color specifications for the background parameter and checks them
        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return "globals -> " + color;
        else
            this.background = color;

        this.log("Parsed globals");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;
        
        this.lightNames = [];
        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            // Checks the type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular", "attenuation"]);
                attributeTypes.push(...["position", "color", "color", "color", "attenuation"]);
            }

            // Gets the id of the current light
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated ids
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Get the light's 'enabled' component. If it's corrupted, then assumes it's enabled
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
            else
                enableLight = aux;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;

            // Specifications for the current light
            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position") {
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    }
                    else if (attributeTypes[j] == "attenuation") {
                        var constant = this.reader.getFloat(grandChildren[attributeIndex], 'constant');
                        var linear = this.reader.getFloat(grandChildren[attributeIndex], 'linear');
                        var quadratic = this.reader.getFloat(grandChildren[attributeIndex], 'quadratic');
                        
                        var aux = [];
                        aux.push(...[constant, linear, quadratic]);
                    }
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[j] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light's target
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }
            
            // Stores the unique name of the light (id)
            this.lightNames.push(lightId);

            // Stores the light in a dictionary, with the key being its id
            this.lights[lightId] = global;

            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var children = texturesNode.children;

        this.textures = [];

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            } 

            // Gets the id of the current texture
            var textureId = this.reader.getString(children[i], 'id');
            if (textureId == null)
                return "no ID defined for texture";   

            // Checks for repeated ids.
            if (this.textures[textureId] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";

            // Gets the file location of the current texture   
            var file = this.reader.getString(children[i], 'file');
            if (file == null)
                return "no file defined for texture with id " + textureId;
            
            // Creates the texture
            var new_texture = new CGFtexture(this.scene, file);

            // Checks if the file exists
            if(new_texture == null)
                return "the file for the texture is incorrect";

            this.textures[textureId] = new_texture;             
        }

        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Gets the id of the current material
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated ids
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            // Gets the shininess of the current material.
            let shininess = this.reader.getFloat(children[i], 'shininess');
            if (shininess == null)
                return "no shininess defined for material";

            // Gets the material's components
            grandChildren = children[i].children;

            // Checks if the material has the correct number of components...
            if(grandChildren.length != 4)
                return "material must have emission, ambient, diffuse and specular components";
    
            // ...And parses them
            let emission = this.parseColor(grandChildren[0],  "material emission component for ID " + materialID); 
            if (!Array.isArray(emission))
                return emission;

            let ambient = this.parseColor(grandChildren[1], "material ambient component for ID " + materialID);
            if(!Array.isArray(ambient))
                return ambient;

            let diffuse = this.parseColor(grandChildren[2], "material diffuse component for ID " + materialID);
            if(!Array.isArray(diffuse))
                return diffuse;

            let specular = this.parseColor(grandChildren[3], "material specular component for ID " + materialID);
            if(!Array.isArray(specular))
                return specular;
            
            // Creates the new material
            var new_material = new CGFappearance(this.scene);
            new_material.setEmission(emission[0], emission[1], emission[2], emission[3]);
            new_material.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
            new_material.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
            new_material.setSpecular(specular[0], specular[1], specular[2], specular[3]);
            
            this.materials[materialID] = new_material;
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Gets the id of the current transformation
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated ids
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            // Gets the specifications of the transformation
            grandChildren = children[i].children;

            // Specifications for the current transformation will be successively added to a matrix
            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    case 'scale':         
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID " + transformationID);
                        if(!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);   
                        break;
                    case 'rotate':
                        //Axis coordinates
                        var coordinates = this.parseAxis(grandChildren[j], "rotate transformation for ID " + transformationID);
                        if(!Array.isArray(coordinates))
                            return coordinates;

                        // angle
                        var angle = this.parseAngle(grandChildren[j], "rotate transformation for ID " + transformationID);
                        if(isNaN(angle))
                            return angle;

                        transfMatrix = mat4.rotate(transfMatrix, transfMatrix, this.degreeToRad(angle), coordinates);
                        break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Converts angles in degrees to radians
     */
    degreeToRad(angle){
        return Math.PI*angle/180;
    }

    /**
     * Parses the <animations> block.
     * @param {animations block element} animationsNode 
     */
    parseAnimations(animationsNode){
        var children = animationsNode.children;
        if(children.length === 0) //<animations> block is empty
            return null;
        
        this.animations = [];
        var grandChildren = [];
        var grandgrandChildren = [];

        //Any number of animations
        for(var i = 0; i < children.length; i++){
            if(children[i].nodeName != "animation"){
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            
            // Gets the id of the current animation
            var animationId = this.reader.getString(children[i], 'id');
            if (animationId == null)
                return "no ID defined for animation";

            // Checks for repeated ids
            if (this.animations[animationId] != null)
                return "ID must be unique for each animation (conflict: ID = " + animationId + ")";

            // Gets the keyframes of the animation
            grandChildren = children[i].children;

            if(grandChildren.length === 0)
                return "animation must have at least one keyframe defined";
            
            let keyframes = [];

            for(var j = 0; j < grandChildren.length; j++){
                grandgrandChildren = grandChildren[j].children;
                let keyframeInstant = this.reader.getFloat(grandChildren[j], 'instant');

                if(grandgrandChildren.length !== 3)
                    return "keyframe at instant "+keyframeInstant+" of animation "+animationId+" must have translate, rotate and scale defined";
                
                //Parse translate coordinates
                if(grandgrandChildren[0].nodeName != "translate")
                    return "translate has to be the first transformation of the keyframe";
                let translateCoordinates = this.parseCoordinates3D(grandgrandChildren[0], "translate transformation for the keyframe at instant "+keyframeInstant+" of the animation with the ID "+ animationId);
                if(!Array.isArray(translateCoordinates))
                    return translateCoordinates;
                  
                //Parse rotate angles
                if(grandgrandChildren[1].nodeName != "rotate")
                    return "rotate has to be the second transformation of the keyframe";
                let rotateAngles = this.parseAngles3D(grandgrandChildren[1], "rotate transformation for the keyframe at instant "+keyframeInstant+" of the animation with the ID "+ animationId);
                if(!Array.isArray(rotateAngles))
                    return rotateAngles;

                //Parse scale coordinates
                if(grandgrandChildren[2].nodeName != "scale")
                    return "scale has to be the third transformation of the keyframe";
                let scaleCoordinates = this.parseCoordinates3D(grandgrandChildren[2], "scale transformation for the keyframe at instant "+keyframeInstant+" of the animation with the ID "+ animationId);
                if(!Array.isArray(scaleCoordinates))
                    return scaleCoordinates;   

                keyframes.push({
                    'keyframeInstant': keyframeInstant, 
                    'translateCoordinates': translateCoordinates, 
                    'rotateAngles': rotateAngles, 
                    'scaleCoordinates': scaleCoordinates
                });
            }

            // Sorts the keyframes, so that none is missed when a keyframe that happens sooner is inserted after
            // one that happens later
            keyframes.sort((kf1, kf2) => (kf1.keyframeInstant >= kf2.keyframeInstant) ? 1 : -1); 
            this.animations[animationId] = new KeyframeAnimation(keyframes);
        }

        this.log("Parsed animations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Gets the id of the current primitive
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for primitive";

            // Checks for repeated ids
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            // Gets the specifications of the primitive
            grandChildren = children[i].children;

            // Validates the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus' && grandChildren[0].nodeName != 'cylinder2' && 
                    grandChildren[0].nodeName != 'patch' && grandChildren[0].nodeName != 'plane')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere, torus, plane, patch or cylinder2) at primitive with ID " + primitiveId;
            }

            // Specifications for the current primitive
            var primitiveType = grandChildren[0].nodeName;

            // RECTANGLE
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }

            // SPHERE
            else if (primitiveType == 'sphere') {
                // radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var sph = new MySphere(this.scene, primitiveId, radius, slices, stacks);   

                this.primitives[primitiveId] = sph;
            }

            // CYLINDER
            else if (primitiveType == 'cylinder') {
                // base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;
                
                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;
                
                // height  
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var cylinder = new MyCylinder(this.scene, base, top, height, slices, stacks);   

                this.primitives[primitiveId] = cylinder;
            }

            //TRIANGLE
            else if (primitiveType == 'triangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyTriangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);

                this.primitives[primitiveId] = rect;
            }

            //TORUS
            else if (primitiveType == 'torus') {
                // inner
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;
                
                // outer
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // loops
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

                var torus = new MyTorus(this.scene, inner, outer, slices, loops);   

                this.primitives[primitiveId] = torus;
            }

            // PATCH
            else if (primitiveType == 'patch') {

                // npointsU
                let npointsU = this.reader.getInteger(grandChildren[0], 'npointsU');
                if (!(npointsU != null && !isNaN(slices)))
                    return "unable to parse npointsU for primitive with ID = " + primitiveId;

                // npointsV
                let npointsV = this.reader.getInteger(grandChildren[0], 'npointsV');
                if (!(npointsV != null && !isNaN(slices)))
                    return "unable to parse npointsV for primitive with ID = " + primitiveId;
                    
                // npartsU
                let npartsU = this.reader.getInteger(grandChildren[0], 'npartsU');
                if (!(npartsU != null && !isNaN(slices)))
                    return "unable to parse npartsU for primitive with ID = " + primitiveId;
                    
                // npartsV
                let npartsV = this.reader.getInteger(grandChildren[0], 'npartsV');
                if (!(npartsV != null && !isNaN(slices)))
                    return "unable to parse npartsV for primitive with ID = " + primitiveId;  

                // control points
                let grandgrandChildren = grandChildren[0].children;
                if(grandgrandChildren.length < npointsU*npointsV)
                    return "patch primitive must have exactly " + npointsU*npointsV + " control points, at ID = " + primitiveId;
                
                let controlPoints = [];
                for(let i = 0; i < grandgrandChildren.length; i ++) {
                    if(grandgrandChildren[i].length < npointsU*npointsV)
                        return "control point number " + i + " must have exactly 3 parameteres: xx, yy and zz, at primitive with ID = " + primitiveId;

                    let xx = this.reader.getFloat(grandgrandChildren[i], 'xx');
                    if(!(xx != null && !isNaN(xx)))
                        return "unable to parsse xx of control point number " + i + " at primitive with ID = " + primitiveId;
                        
                    let yy = this.reader.getFloat(grandgrandChildren[i], 'yy');
                    if(!(yy != null && !isNaN(yy)))
                        return "unable to parsse yy of control point number " + i + " at primitive with ID = " + primitiveId; 

                    let zz = this.reader.getFloat(grandgrandChildren[i], 'zz');
                    if(!(zz != null && !isNaN(zz)))
                        return "unable to parsse zz of control point number " + i + " at primitive with ID = " + primitiveId; 
                    
                    let point = [];

                    // Creates a point with 4 coordinates
                    point.push(...[xx, yy, zz, 1]);

                    // And pushes all of them in a row, to a single vector
                    controlPoints.push(point);
                }

                let patch = new MyPatch(this.scene, npointsU, npointsV, npartsU, npartsV, controlPoints);

                this.primitives[primitiveId] = patch;             
            }

            // PLANE
            else if (primitiveType == 'plane') {

                // npartsU
                let npartsU = this.reader.getInteger(grandChildren[0], 'npartsU');
                if (!(npartsU != null && !isNaN(slices)))
                    return "unable to parse npartsU for primitive with ID = " + primitiveId;
                    
                // npartsV
                let npartsV = this.reader.getInteger(grandChildren[0], 'npartsV');
                if (!(npartsV != null && !isNaN(slices)))
                    return "unable to parse npartsV for primitive with ID = " + primitiveId;  
                    
                let plane = new MyPlane(this.scene, npartsU, npartsV);
                
                this.primitives[primitiveId] = plane;
            }

            // CYLINDER2
            else if (primitiveType == "cylinder2") {

                // base
                let base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;
                
                // top
                let top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;
                
                // height  
                let height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                // slices
                let slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                let stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                let cylinder2 = new MyCylinder2(this.scene, base, top, height, slices, stacks);   

                this.primitives[primitiveId] = cylinder2;                
            }

            // UNKNOWN
            else {
                this.onXMLMinorError("unknow primitive type '" + primitiveType + "' at primitive with ID = " + primitiveId);
            }
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {   
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated ids
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            // Creates an empty component using JavaScript Objects
            const component = new Object();
            component.materialIds = [];
            component.componentIds = [];
            component.primitiveIds = [];

            component.id = componentID;

            //Stores transformation(s), material(s), texture and reference(s) to components/primitives
            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets the index of the transformation component and checks if it exists
            var transformationIndex = nodeNames.indexOf("transformation");
            if(transformationIndex == -1)
                return "transformation parameter is undefined for component with ID " + component.id;

            // Gets the index of the animation component and, if it exists, checks if it's right after the transformations
            var animationIndex = nodeNames.indexOf("animationref");
            if(animationIndex != -1) {
                if(animationIndex != transformationIndex + 1)
                    return "animationref parameter must be declared immediately after the transformation parameter, for component with ID " + component.id;
            }

            // Gets the index of the materials component and checks if it exists
            var materialsIndex = nodeNames.indexOf("materials");
            if(materialsIndex == -1)
                return "materials parameter is undefined for component with ID " + component.id;

            // Gets the index of the texture component and checks if it exists                       
            var textureIndex = nodeNames.indexOf("texture");
            if(textureIndex == -1)
                return "texture parameter is undefined for component with ID " + component.id;

            // Gets the index of the children component and checks if it exists                
            var childrenIndex = nodeNames.indexOf("children");
            if(childrenIndex == -1)
                return "children parameter is undefined for component with ID " + component.id;            

            // Transformations
            var transfMatrix;
            grandgrandChildren = grandChildren[transformationIndex].children;
                  
            if(grandgrandChildren.length == 1 && grandgrandChildren[0].nodeName == "transformationref"){
                if(grandgrandChildren.length > 1)
                    return "component " + componentID + " can only have one transformationref in its transformation";
            
                var transformationID = this.reader.getString(grandgrandChildren[0], 'id');
                if(transformationID == null)
                    return "no ID defined for component with ID " + component.id;

                // Checks if the transformation exists
                if (this.transformations[transformationID] == null && transformationID != "inherit")
                    return "transformation with ID " + transformationID + " must exist ";

                transfMatrix = this.transformations[transformationID];
            }
            else{
                transfMatrix = mat4.create();

                let mix_count = 0;

                for (var j = 0; j < grandgrandChildren.length; j++) {
                    switch (grandgrandChildren[j].nodeName) {
                        case 'translate':
                            var coordinates = this.parseCoordinates3D(grandgrandChildren[j], "translate transformation for component with ID " + component.id);
                            if (!Array.isArray(coordinates))
                                return coordinates;

                            transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                            break;
                        case 'scale':         
                            var coordinates = this.parseCoordinates3D(grandgrandChildren[j], "scale transformation for component with ID " + component.id);
                            if(!Array.isArray(coordinates))
                                return coordinates;

                            transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);   
                            break;
                        case 'rotate':
                            //Axis coordinates
                            var coordinates = this.parseAxis(grandgrandChildren[j], "rotate transformation for component with ID " + component.id);
                            if(!Array.isArray(coordinates))
                                return coordinates;

                            // angle
                            var angle = this.parseAngle(grandgrandChildren[j], "rotate transformation for component with ID " + component.id);
                            if(isNaN(angle))
                                return angle;

                            transfMatrix = mat4.rotate(transfMatrix, transfMatrix, this.degreeToRad(angle), coordinates);
                            break;
                        case 'transformationref':
                            if(mix_count === 0)
                                this.onXMLMinorError("References to transformations are being mixed with explicit transformations on the component with ID " + component.id + ". They will be ignored.");

                            mix_count++;
                            break;
                        default:
                            return grandgrandChildren[j].nodeName + " is not a valid transformation for component with ID " + component.id;
                    }
                }
            }
            component.transformationMatrix = transfMatrix;

            // Animation (optional - right after transformations)
            component.animationId = null;
            if(animationIndex != -1) {
                grandgrandChildren = grandChildren[animationIndex];

                // Checks if the texture has an ID           
                if(!this.reader.hasAttribute(grandgrandChildren, "id"))
                    return "there is no ID parameter on the animation reference for component with ID " + component.id;

                const animationId = this.reader.getString(grandgrandChildren, 'id');
                if(animationId !== null)
                    component.animationId = animationId;
                else 
                    return "there must be a valid ID for the animation on the component with ID " + component.id;    

                component.animationId = animationId;
            }
            


            // Materials
            grandgrandChildren = grandChildren[materialsIndex].children;
              
            // Checks if there is at least one material
            if(grandgrandChildren.length == 0)
                return "there must be at least one reference to a material";
              
            // Gets the id of each material    
            for(var j = 0; j < grandgrandChildren.length; j++) {
                
                // Checks if the id component exists
                if(!this.reader.hasAttribute(grandgrandChildren[j], "id"))
                    return "there is no ID parameter on the material for component with ID " + component.id;
                
                // Stores it
                var materialId = this.reader.getString(grandgrandChildren[j], 'id');                
                component.materialIds.push(materialId);
            }                      

            // Texture
            var textureNode = 0;
            grandgrandChildren = grandChildren[textureIndex];   

            // Checks if the texture has an ID           
            if(!this.reader.hasAttribute(grandgrandChildren, "id"))
                return "there is no ID parameter on the texture for component with ID " + component.id;

            const textureId = this.reader.getString(grandgrandChildren, 'id');
            if(textureId !== null)
                component.textureId = textureId;
            else 
                return "there must be a valid ID (texture reference, none or inherit) for texture";
            
            let length_s = 1, length_t = 1;
            if(textureId !== "none" && textureId !== "inherit"){
                length_s = this.reader.getFloat(grandgrandChildren, 'length_s');
                if(length_s === null)
                    return "there must be a value for length_s of the texture";

                length_t = this.reader.getFloat(grandgrandChildren, 'length_t');
                if(length_s === null)
                    return "there must be a value for length_t of the texture";
            }
            else{
                if(this.reader.hasAttribute(grandgrandChildren, "length_s") || this.reader.hasAttribute(grandgrandChildren, "length_t"))
                    this.onXMLMinorError("texture for component with ID " + component.id + " does not need to have length_s/length_t");
            }
            component.textureLengthS = length_s;
            component.textureLengthT = length_t;

            // Children
            grandgrandChildren = grandChildren[childrenIndex].children;

            if(grandgrandChildren.length == 0)
                return "there must be at least one reference to a component or primitive";

            for(var j = 0; j < grandgrandChildren.length; j++) {
                switch (grandgrandChildren[j].nodeName) {
                    case 'componentref':

                        // Checks if the id parameter exists
                        if(!this.reader.hasAttribute(grandgrandChildren[j], "id"))
                            return "there is no ID on a children of component with ID " + component.id;

                        var childrenComponentId = this.reader.getString(grandgrandChildren[j], 'id');
                        component.componentIds.push(childrenComponentId);
                        break;
                    case 'primitiveref':   

                        // Checks if the id parameter exists
                        if(!this.reader.hasAttribute(grandgrandChildren[j], "id"))
                            return "there is no ID on a children of component with ID " + component.id;
                          
                        var childrenPrimitiveId = this.reader.getString(grandgrandChildren[j], 'id');
                        component.primitiveIds.push(childrenPrimitiveId);
                        break;
                    default:
                        this.onXMLMinorError("unknown node on component with ID " + component.id);
                }            
            }

            //Adding the component
            this.components[component.id] = component;
        }

        this.log("Parsed components");
        return null;
    }

      /**
     * Parse the angles from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseAngles3D(node, messageError) {
        let angles = [];

        // x
        let x = this.reader.getFloat(node, 'angle_x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-angle of the " + messageError;

        // y
        let y = this.reader.getFloat(node, 'angle_y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-angle of the " + messageError;

        // z
        let z = this.reader.getFloat(node, 'angle_z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-angle of the " + messageError;

        angles.push(...[x, y, z]);

        return angles;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the rotation axis from a node with ID = id
     * @param {block element} node 
     * @param {message to be displayed in case of error} messageError 
     */
    parseAxis(node, messageError){
        let axis = "";

        //Get axis
        axis = this.reader.getString(node, "axis");
        if(axis == null)
            return "unable to parse axis of the " + messageError;

        if(axis === "x")
            return [1, 0, 0];
        else if(axis === "y")
            return [0, 1, 0];
        else if(axis === "z")
            return [0, 0, 1];
        
        //If occurs an error
        return "unable to detect that axis of the " + messageError; 
    }

    /**
     * 
     * @param {block element} node 
     * @param {message to be displayed in case of error} messageError 
     */
    parseAngle(node, messageError){
        //Get angle
        var angle = 0;
        angle = this.reader.getFloat(node, "angle");
        if(!(angle != null && !isNaN(angle)))
            return "unable to parse angle of the " + messageError;
        
        return angle;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        //TABLE TOP
        this.scene.pushMatrix();
            this.scene.translate(0, 0.5, 0);
            this.scene.scale(18, 1, 9);
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            this.primitives['rectangle'].display();
        this.scene.popMatrix();

        //TABLE BOTTOM
        this.scene.pushMatrix();
            this.scene.scale(18, 1, 9);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.primitives['rectangle'].display();
        this.scene.popMatrix();

        //TABLE FRONT SIDE
        this.scene.pushMatrix();
            this.scene.translate(0, 0.25, 9);
            this.scene.scale(18, 0.25, 1);
            this.primitives['rectangle'].display();
        this.scene.popMatrix();

        //TABLE BACK SIDE
        this.scene.pushMatrix();
            this.scene.translate(0, 0.25, -9);
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.scene.scale(18, 0.25, 1);
            this.primitives['rectangle'].display();
        this.scene.popMatrix();

        //TABLE RIGHT SIDE
        this.scene.pushMatrix();
            this.scene.translate(9, 0.25, 0);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.scene.scale(18, 0.25, 1);
            this.primitives['rectangle'].display();
        this.scene.popMatrix();

        //TABLE LEFT SIDE
        this.scene.pushMatrix();
            this.scene.translate(-9, 0.25, 0);
            this.scene.rotate(-Math.PI/2, 0, 1, 0);
            this.scene.scale(18, 0.25, 1);
            this.primitives['rectangle'].display();
        this.scene.popMatrix();

        //TABLE LEGS
        this.scene.pushMatrix();
            //TABLE FRONT LEFT LEG
            this.scene.pushMatrix();            
                this.scene.translate(-8, 0, 8);

                //TABLE LEG
                this.scene.pushMatrix();
                    this.scene.pushMatrix();
                        this.scene.translate(0, -4, 0.5);
                        this.scene.scale(1, 4, 1);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(0, -4, -0.5);
                        this.scene.rotate(Math.PI, 0, 1, 0);
                        this.scene.scale(1, 4, 1);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(0.5, -4, 0);
                        this.scene.rotate(Math.PI/2, 0, 1, 0);
                        this.scene.scale(1, 4, 1);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(-0.5, -4, 0);
                        this.scene.rotate(-Math.PI/2, 0, 1, 0);
                        this.scene.scale(1, 4, 1);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.scale(1, 1, 0.5);
                        this.scene.translate(0, -8, 0);
                        this.scene.rotate(Math.PI/2, 1, 0, 0);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();
                this.scene.popMatrix();
            this.scene.popMatrix();

            //TABLE FRONT RIGHT LEG
            this.scene.pushMatrix();            
                this.scene.translate(8, 0, 8);

                //TABLE LEG
                this.scene.pushMatrix();
                    this.scene.pushMatrix();
                        this.scene.translate(0, -4, 0.5);
                        this.scene.scale(1, 4, 1);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(0, -4, -0.5);
                        this.scene.rotate(Math.PI, 0, 1, 0);
                        this.scene.scale(1, 4, 1);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(0.5, -4, 0);
                        this.scene.rotate(Math.PI/2, 0, 1, 0);
                        this.scene.scale(1, 4, 1);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(-0.5, -4, 0);
                        this.scene.rotate(-Math.PI/2, 0, 1, 0);
                        this.scene.scale(1, 4, 1);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.scale(1, 1, 0.5);
                        this.scene.translate(0, -8, 0);
                        this.scene.rotate(Math.PI/2, 1, 0, 0);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();
                this.scene.popMatrix();
            this.scene.popMatrix();

            //TABLE BACK LEFT LEG
            this.scene.pushMatrix();            
                this.scene.translate(-8, 0, -8);

                //TABLE LEG
                this.scene.pushMatrix();
                    this.scene.pushMatrix();
                        this.scene.translate(0, -4, 0.5);
                        this.scene.scale(1, 4, 1);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(0, -4, -0.5);
                        this.scene.rotate(Math.PI, 0, 1, 0);
                        this.scene.scale(1, 4, 1);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(0.5, -4, 0);
                        this.scene.rotate(Math.PI/2, 0, 1, 0);
                        this.scene.scale(1, 4, 1);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(-0.5, -4, 0);
                        this.scene.rotate(-Math.PI/2, 0, 1, 0);
                        this.scene.scale(1, 4, 1);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.scale(1, 1, 0.5);
                        this.scene.translate(0, -8, 0);
                        this.scene.rotate(Math.PI/2, 1, 0, 0);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();
                this.scene.popMatrix();
            this.scene.popMatrix();

            //TABLE FRONT LEFT LEG
            this.scene.pushMatrix();            
                this.scene.translate(8, 0, -8);

                //TABLE LEG
                this.scene.pushMatrix();
                    this.scene.pushMatrix();
                        this.scene.translate(0, -4, 0.5);
                        this.scene.scale(1, 4, 1);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(0, -4, -0.5);
                        this.scene.rotate(Math.PI, 0, 1, 0);
                        this.scene.scale(1, 4, 1);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(0.5, -4, 0);
                        this.scene.rotate(Math.PI/2, 0, 1, 0);
                        this.scene.scale(1, 4, 1);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(-0.5, -4, 0);
                        this.scene.rotate(-Math.PI/2, 0, 1, 0);
                        this.scene.scale(1, 4, 1);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.scale(1, 1, 0.5);
                        this.scene.translate(0, -8, 0);
                        this.scene.rotate(Math.PI/2, 1, 0, 0);
                        this.primitives['rectangle'].display();
                    this.scene.popMatrix();
                this.scene.popMatrix();
            this.scene.popMatrix();
        this.scene.popMatrix();

        //this.traverseGraph(this.idRoot, 'demoMaterial', 'demoTexture', 1, 1);
    }

    /**
     * Uses a depth first search to traverse the scene graph and display it
     */
    traverseGraph(idNode, idCurrentMaterial, idCurrentTexture, currentLenghtS, currentLengthT) {
        
        let currentNode = this.components[idNode];
    
        // Updates the current material's id
        if(currentNode.materialIds[this.clickM % currentNode.materialIds.length] !== 'inherit')
            idCurrentMaterial = currentNode.materialIds[(this.clickM) % (currentNode.materialIds.length)]; //0 FOR NOW
        

        // Updates the current texture's id
        if(currentNode.textureId !== 'inherit') {
            idCurrentTexture = currentNode.textureId;
            currentLenghtS = currentNode.textureLengthS;
            currentLengthT = currentNode.textureLengthT;
        }

        // Pushes the matrix so that changes don't affect other components unwillingly
        this.scene.pushMatrix();

        this.scene.multMatrix(currentNode.transformationMatrix);
        
        // Updates the current transformation Matrix
        if(currentNode.animationId) {
            const animation = this.animations[currentNode.animationId];
            animation.apply(this.scene);
        }
        
    
        
        const material = this.materials[idCurrentMaterial];
        if(material === undefined)
            console.log("Undefined material used in the "+idNode+" component");
        
        const texture = this.textures[idCurrentTexture];

        // Traverses the primitives and displays them
        for(let i = 0; i < currentNode.primitiveIds.length; i++) {
            
            // If the texture is differente from 'none', applies it...
            if(texture !== undefined){
                material.setTexture(texture);
                material.setTextureWrap('REPEAT', 'REPEAT');
                this.primitives[currentNode.primitiveIds[i]].updateTexCoords(currentLenghtS, currentLengthT);
            }
            // ..Otherwise, sets it to null
            else
                material.setTexture(null);

            material.apply();
            this.primitives[currentNode.primitiveIds[i]].display();
        }

        for(let i = 0; i < currentNode.componentIds.length; i++) {
            this.traverseGraph(currentNode.componentIds[i], idCurrentMaterial, idCurrentTexture, currentLenghtS, currentLengthT);
        }

        this.scene.popMatrix();         
    }

    /**
     *  Returns the lights array
     */
    getLights(){
        return this.lights;
    }

    /**
     * Returns the views array
     */
    getViews(){
        return this.views;
    }
    
    /**
     * Increases clickM variable
     */
    increaseMCount(){
        this.clickM++;
    }

    /**
     * Updates the animations
     */
    updateAnimations(t) {
        
        for(let key in this.animations) {
            if(this.animations.hasOwnProperty(key)) {
                this.animations[key].update(t/1000.0);
            }
        }
    }
}