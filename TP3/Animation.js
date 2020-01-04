/**
* Abstract Class Animation
*/
class Animation {
    constructor(){
        if(this.constructor === Animation){
            throw new TypeError('Abstract class "Animation" cannot be instantiated directly.');
        }

        this.elapsedTime = 0;
        this.matrix = mat4.create();
    }

    update(t) { //t = time between two updates
        this.elapsedTime += t;
    }

    apply(scene){
        //Apply matrix to scene
        scene.multMatrix(this.matrix);
    }

    getMatrix(){
        return this.matrix;
    }

    getElapsedTime(){
        return this.elapsedTime;
    }

    // Resets the animation time
    resetsTime(){
        this.elapsedTime = 0;
    }

    // Checks if the animation has finished
    hasFinishedAnimation(){
        return this.finishAnimation;
    }

}