/**
* Abstract Class Animation
*/
class Animation {
    constructor(time){
        if(this.constructor === Animation){
            throw new TypeError('Abstract class "Animation" cannot be instantiated directly.');
        }

        this.initialTime = time;
        this.timeElapsed = 0;
    }

    update(t) {}

    apply(scene){}
}