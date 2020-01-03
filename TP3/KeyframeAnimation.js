/**
* Class KeyframeAnimation
*/
class KeyframeAnimation extends Animation {
    constructor(keyframes, loop){
        super();

        this.keyframes = keyframes;
        //this.keyframes: array of keyframes
        /*Keyframe:{
            keyframeInstant, 
            translateCoordinates, 
            rotateAngles, 
            scaleCoordinates
        }*/
        this.firstKeyframe = 0;
        this.secondKeyframe = 1;
        this.finishAnimation = false;
        
        // Adding the initial keyframe
        this.keyframes.unshift({
            'keyframeInstant': 0,
            'translateCoordinates': [0, 0, 0],
            'rotateAngles': [0, 0, 0],
            'scaleCoordinates': [1, 1, 1]
        });

        this.loop = loop || false;
       
        this.createMatrix();
    }

    update(t) { //t = time between two updates
        super.update(t);

        if(this.finishAnimation)
            return;

        // Sets the current keyframe
        for(let i = this.secondKeyframe; i < this.keyframes.length; i++){
            if(this.elapsedTime > this.keyframes[i].keyframeInstant){
                this.firstKeyframe = i;
                this.secondKeyframe = i+1;
                break;
            }
        }
 
        // Determines if the animation has ended
        if(this.secondKeyframe >= this.keyframes.length){
            if(this.loop){
                this.elapsedTime = 0;
                this.firstKeyframe = 0;
                this.secondKeyframe = 1;
            }else{
                this.finishAnimation = true;
                this.createFinalMatrix();
                return;
            }
        }
        
        this.createMatrix();
    }
    
    createMatrix(){
        // Creates and identity matrix, to accumulate the keyframe's transformations
        this.matrix = mat4.create(); 

        // Loads the current keyframe and the next keyframe
        const firstKeyframe = this.keyframes[this.firstKeyframe];
        const secondKeyframe = this.keyframes[this.secondKeyframe];

        // Loads the current keyframe's time and the next keyframe's time
        const firstTime = firstKeyframe.keyframeInstant;
        const secondTime = secondKeyframe.keyframeInstant;

        // Calculates the current time passed between keyframes
        const time = (this.elapsedTime-firstTime)/(secondTime-firstTime);

        // Computes the translation between keyframes, using interpolation
        const translateCoordinates = [
            firstKeyframe.translateCoordinates[0] + time*(secondKeyframe.translateCoordinates[0] - firstKeyframe.translateCoordinates[0]),
            firstKeyframe.translateCoordinates[1] + time*(secondKeyframe.translateCoordinates[1] - firstKeyframe.translateCoordinates[1]),
            firstKeyframe.translateCoordinates[2] + time*(secondKeyframe.translateCoordinates[2] - firstKeyframe.translateCoordinates[2])
        ];

        // Computes the rotation between keyframes, using interpolation
        const rotateAngles = [
            firstKeyframe.rotateAngles[0] + time*(secondKeyframe.rotateAngles[0] - firstKeyframe.rotateAngles[0]),
            firstKeyframe.rotateAngles[1] + time*(secondKeyframe.rotateAngles[1] - firstKeyframe.rotateAngles[1]),
            firstKeyframe.rotateAngles[2] + time*(secondKeyframe.rotateAngles[2] - firstKeyframe.rotateAngles[2])
        ];
        
        // Computes the scaling between keyframes, using interpolation
        const scaleCoordinates = [
            firstKeyframe.scaleCoordinates[0] + time*(secondKeyframe.scaleCoordinates[0] - firstKeyframe.scaleCoordinates[0]),
            firstKeyframe.scaleCoordinates[1] + time*(secondKeyframe.scaleCoordinates[1] - firstKeyframe.scaleCoordinates[1]),
            firstKeyframe.scaleCoordinates[2] + time*(secondKeyframe.scaleCoordinates[2] - firstKeyframe.scaleCoordinates[2])
        ];

        // Accumulates the transformation on a matrix
        this.matrix = mat4.translate(this.matrix, this.matrix, translateCoordinates);
        this.matrix = mat4.rotate(this.matrix, this.matrix, this.degreeToRad(rotateAngles[0]), [1, 0, 0]);
        this.matrix = mat4.rotate(this.matrix, this.matrix, this.degreeToRad(rotateAngles[1]), [0, 1, 0]);
        this.matrix = mat4.rotate(this.matrix, this.matrix, this.degreeToRad(rotateAngles[2]), [0, 0, 1]);
        this.matrix = mat4.scale(this.matrix, this.matrix, scaleCoordinates);
    }

    // When the animation has ended, calculates the matrix for the object's final position
    createFinalMatrix(){
        this.matrix = mat4.create(); 
        const keyframe = this.keyframes[this.keyframes.length-1];

        // Fetches the translation
        const translateCoordinates = [ 
            keyframe.translateCoordinates[0], 
            keyframe.translateCoordinates[1], 
            keyframe.translateCoordinates[2]
        ];

        // Fetches the rotation
        const rotateAngles = [
            keyframe.rotateAngles[0],
            keyframe.rotateAngles[1],
            keyframe.rotateAngles[2]
        ];
        
        // Fetches the scaling
        const scaleCoordinates = [
            keyframe.scaleCoordinates[0],
            keyframe.scaleCoordinates[1],
            keyframe.scaleCoordinates[2]
        ];

        // Computes the matrix
        this.matrix = mat4.translate(this.matrix, this.matrix, translateCoordinates);
        this.matrix = mat4.rotate(this.matrix, this.matrix, this.degreeToRad(rotateAngles[0]), [1, 0, 0]);
        this.matrix = mat4.rotate(this.matrix, this.matrix, this.degreeToRad(rotateAngles[1]), [0, 1, 0]);
        this.matrix = mat4.rotate(this.matrix, this.matrix, this.degreeToRad(rotateAngles[2]), [0, 0, 1]);
        this.matrix = mat4.scale(this.matrix, this.matrix, scaleCoordinates);
    }

    // Helper function that converts degrees (used in the XML file) to radians (used in WebCGF)
    degreeToRad(angle){
        return Math.PI*angle/180;
    }

    // Checks if the animation has finished
    hasFinishedAnimation(){
        return this.finishAnimation;
    }

}