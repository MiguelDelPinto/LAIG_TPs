/**
* Class KeyframeAnimation
*/
class KeyframeAnimation extends Animation {
    constructor(time, keyframes){
        super(time);

        this.keyframes = keyframes;
    }

    update(t) {
        
    }

    apply(scene){}
}