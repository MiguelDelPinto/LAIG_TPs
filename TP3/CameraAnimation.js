/**
* Class CameraAnimation
*/
class CameraAnimation extends Animation {
    constructor(camera, factor){
        super();

        this.camera = camera;
        this.factor = factor;
    }

    update(t){
        if(this.finishAnimation)
            return;
        
        this.lastElapsedTime = this.elapsedTime;
            
        super.update(t);
        
        if(this.elapsedTime >= 1000){
            this.camera.orbit(CGFcameraAxis.Y, this.factor*Math.PI*(1000-this.lastElapsedTime)/1000.0);
            this.finishAnimation = true;
            return;
        }
        
        this.camera.orbit(CGFcameraAxis.Y, this.factor*Math.PI*t/1000.0);
    }

    hasFinished
}