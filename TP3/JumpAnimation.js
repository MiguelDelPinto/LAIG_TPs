/**
* Class JumpAnimation
*/
class JumpAnimation extends Animation {
    constructor(func, totalTime){
        super();

        this.func = func;
        this.totalTime = totalTime;

        this.finishAnimation = false;
       
        this.createMatrix();
    }

    update(t) { //t = time between two updates
        super.update(t);

        // Determines if the animation has ended
        if(this.elapsedTime > this.totalTime){
            this.elapsedTime -= this.totalTime; 
        }
        
        this.createMatrix();
    }

    createMatrix(){
        // Creates and identity matrix, to accumulate the jump transformation
        this.matrix = mat4.create(); 

        // Computes the translation, using a function
        const translateCoordinates = [0, this.func(this.elapsedTime/1000.0), 0];

        // Accumulates the transformation on a matrix
        this.matrix = mat4.translate(this.matrix, this.matrix, translateCoordinates);
    }

    // When the animation has ended, calculates the matrix for the object's final position
    createFinalMatrix(){
        this.matrix = mat4.create(); 

        // Fetches the translation
        const translateCoordinates = [0, 0, 0];

        // Computes the matrix
        this.matrix = mat4.translate(this.matrix, this.matrix, translateCoordinates);
    }

    // Gets animation total time
    getTotalTime(){
        return this.totalTime;
    }
}