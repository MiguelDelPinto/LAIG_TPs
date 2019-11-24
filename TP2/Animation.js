/**
* Abstract Class Animation
*/
class Animation {
    constructor(){
        if(this.constructor === Animation){
            throw new TypeError('Abstract class "Animation" cannot be instantiated directly.');
        }

        this.elapsedTime = 0;
    }

    update(t) { //t = time between two updates
        this.elapsedTime += t;
    }

    apply(scene){
        //Apply matrix to scene
        scene.multMatrix(this.matrix);
    }
}