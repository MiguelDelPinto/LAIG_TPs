/**
* Class KeyframeAnimation
*/
class KeyframeAnimation extends Animation {
    constructor(keyframes){
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
        
        //Adding the initial keyframe
        this.keyframes.unshift({
            'keyframeInstant': 0,
            'translateCoordinates': [0, 0, 0],
            'rotateAngles': [0, 0, 0],
            'scaleCoordinates': [1, 1, 1]
        });
       
        this.createMatrix();
    }

    update(t) { //t = time between two updates
        super.update(t);

        if(this.finishAnimation)
            return;

        for(let i = this.secondKeyframe; i < this.keyframes.length; i++){
            if(this.elapsedTime > this.keyframes[i].keyframeInstant){
                this.firstKeyframe = i;
                this.secondKeyframe = i+1;
                break;
            }
        }

        if(this.secondKeyframe >= this.keyframes.length){
            this.finishAnimation = true;
            this.createFinalMatrix();
            return;
        }
        
        this.createMatrix();
    }

    apply(scene){
        //Apply matrix to scene
        scene.multMatrix(this.matrix);
    }

    createMatrix(){
        this.matrix = mat4.create(); 
        const firstKeyframe = this.keyframes[this.firstKeyframe];
        const secondKeyframe = this.keyframes[this.secondKeyframe];

        const firstTime = firstKeyframe.keyframeInstant;
        const secondTime = secondKeyframe.keyframeInstant;
        const time = (this.elapsedTime-firstTime)/(secondTime-firstTime);

        const translateCoordinates = [
            firstKeyframe.translateCoordinates[0] + time*(secondKeyframe.translateCoordinates[0] - firstKeyframe.translateCoordinates[0]),
            firstKeyframe.translateCoordinates[1] + time*(secondKeyframe.translateCoordinates[1] - firstKeyframe.translateCoordinates[1]),
            firstKeyframe.translateCoordinates[2] + time*(secondKeyframe.translateCoordinates[2] - firstKeyframe.translateCoordinates[2])
        ];

        const rotateAngles = [
            firstKeyframe.rotateAngles[0] + time*(secondKeyframe.rotateAngles[0] - firstKeyframe.rotateAngles[0]),
            firstKeyframe.rotateAngles[1] + time*(secondKeyframe.rotateAngles[1] - firstKeyframe.rotateAngles[1]),
            firstKeyframe.rotateAngles[2] + time*(secondKeyframe.rotateAngles[2] - firstKeyframe.rotateAngles[2])
        ];
        
        const scaleCoordinates = [
            firstKeyframe.scaleCoordinates[0] + time*(secondKeyframe.scaleCoordinates[0] - firstKeyframe.scaleCoordinates[0]),
            firstKeyframe.scaleCoordinates[1] + time*(secondKeyframe.scaleCoordinates[1] - firstKeyframe.scaleCoordinates[1]),
            firstKeyframe.scaleCoordinates[2] + time*(secondKeyframe.scaleCoordinates[2] - firstKeyframe.scaleCoordinates[2])
        ];

        this.matrix = mat4.translate(this.matrix, this.matrix, translateCoordinates);
        this.matrix = mat4.rotate(this.matrix, this.matrix, this.degreeToRad(rotateAngles[0]), [1, 0, 0]);
        this.matrix = mat4.rotate(this.matrix, this.matrix, this.degreeToRad(rotateAngles[1]), [0, 1, 0]);
        this.matrix = mat4.rotate(this.matrix, this.matrix, this.degreeToRad(rotateAngles[2]), [0, 0, 1]);
        this.matrix = mat4.scale(this.matrix, this.matrix, scaleCoordinates);
    }

    createFinalMatrix(){
        this.matrix = mat4.create(); 
        const keyframe = this.keyframes[this.keyframes.length-1];

        const translateCoordinates = [ 
            keyframe.translateCoordinates[0], 
            keyframe.translateCoordinates[1], 
            keyframe.translateCoordinates[2]
        ];

        const rotateAngles = [
            keyframe.rotateAngles[0],
            keyframe.rotateAngles[1],
            keyframe.rotateAngles[2]
        ];
        
        const scaleCoordinates = [
            keyframe.scaleCoordinates[0],
            keyframe.scaleCoordinates[1],
            keyframe.scaleCoordinates[2]
        ];

        this.matrix = mat4.translate(this.matrix, this.matrix, translateCoordinates);
        this.matrix = mat4.rotate(this.matrix, this.matrix, this.degreeToRad(rotateAngles[0]), [1, 0, 0]);
        this.matrix = mat4.rotate(this.matrix, this.matrix, this.degreeToRad(rotateAngles[1]), [0, 1, 0]);
        this.matrix = mat4.rotate(this.matrix, this.matrix, this.degreeToRad(rotateAngles[2]), [0, 0, 1]);
        this.matrix = mat4.scale(this.matrix, this.matrix, scaleCoordinates);
    }

    degreeToRad(angle){
        return Math.PI*angle/180;
    }

}