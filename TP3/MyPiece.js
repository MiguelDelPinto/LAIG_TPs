/**
 * MyPiece
 */
class MyPiece extends CGFobject {   
    constructor(scene, id, piece, row, column, material, color) {
        super(scene);

        this.id = id;    
        this.row = row;
        this.column = column;
        this.material = material;
        this.color = color;

        this.selected = false;
        this.possiblePicking = false;
        this.moving = false;
        this.moveAnimation = null;
        this.endPosition = null;

        this.piece = piece || new MyFrog(scene, 'frog');

        this.selectAnimation = new JumpAnimation(x => {
            return 2 - 8*Math.pow(x - 0.5, 2);
        }, 1000);

        this.invisible = false;
        //this.initShaders();
    }

    /*initShaders(){
        this.shader = new CGFshader(
            this.scene.gl,
            "shaders/invisible.vert",
            "shaders/invisible.frag"
        );
    }*/

    display(pieceScale){
        this.scene.pushMatrix();
            if(!this.invisible){
                this.scene.scale(...this.invertScale(pieceScale));
                if(this.moving){
                    this.moveAnimation.apply(this.scene);
                }
                else if(this.selected){
                    this.selectAnimation.apply(this.scene);
                }

                this.scene.scale(...pieceScale);
                this.material.apply();
                this.piece.display();
            }
        this.scene.popMatrix();
    }

    invertScale(scale){
        return [1/scale[0], 1/scale[1], 1/scale[2]];
    }

    select(){
        if(!this.invisible){
            console.log("selected: " + this.row + "; " + this.column);
            this.selected = true;
            this.selectAnimation.resetsTime();
            this.selectAnimation.finishAnimation = false;
        }
    }

    deselect(){
        if(!this.invisible){
            console.log("deselected: " + this.row + "; " + this.column);
            this.selected = false;
        }
    }
    
    update(t){
        if(!this.invisible){
            if(this.selected){
                this.selectAnimation.update(t);
            }

            if(this.moving){
                this.moveAnimation.update(t/1000.0);
                if(this.moveAnimation.hasFinishedAnimation()){
                    this.row = this.endPosition[0];
                    this.column = this.endPosition[1];
                    this.moving = false;
                    this.moveAnimation = null;
                    this.selectAnimation.resetsTime();
                }
            }
        }
    }

    canBePicked(){
        return this.possiblePicking;
    }

    enablePicking(){
        this.possiblePicking = true;
    }

    disablePicking(){
        this.possiblePicking = false;
    }

    getRow(){
        return this.row;
    }

    getColumn(){
        return this.column;
    }

    move(start, end, maxHeight){
        if(!this.invisible){
            let initAngle = 0;
            let rotate = this.getRotateAngle(start, end);
            let initZTransl = 0;

            if(this.color === "blue"){
                initAngle += 180;
                initZTransl = -0.2;
            }

            let offset = 0;
            if(Math.abs(rotate) > 135) {
                offset = 0.75;
            }
            else if(Math.abs(rotate) > 90) {
                offset = 0.50;
            }
            else if(Math.abs(rotate) > 45) {
                offset = 0.25;
            }            


            let keyframes = [
                {
                    'keyframeInstant': 0, 
                    'translateCoordinates': [0, 0, initZTransl], 
                    'rotateAngles': [0, initAngle, 0],
                    'scaleCoordinates': [1, 1, 1]
                },
                {
                    'keyframeInstant': 0.5 + offset, 
                    'translateCoordinates': [0, 0, initZTransl], 
                    'rotateAngles': [0, rotate, 0], //Rotate to target
                    'scaleCoordinates': [1, 1, 1]
                },
                {
                    'keyframeInstant': 1 + offset, 
                    'translateCoordinates': [(end[0]-start[0])/2, maxHeight, initZTransl + (end[1]-start[1])/2],
                    'rotateAngles': [0, rotate, 0], //Rotate to target
                    'scaleCoordinates': [1, 1, 1]
                },
                {
                    'keyframeInstant': 1.5 + offset, 
                    'translateCoordinates': [end[0]-start[0], 0, initZTransl + end[1]-start[1]],
                    'rotateAngles': [0, rotate, 0], //Rotate to target
                    'scaleCoordinates': [1, 1, 1]
                },
                {
                    'keyframeInstant': 2 + 2*offset, 
                    'translateCoordinates': [end[0]-start[0], 0, initZTransl + end[1]-start[1]],
                    'rotateAngles': [0, initAngle, 0], 
                    'scaleCoordinates': [1, 1, 1]
                }
            ];
            this.moveAnimation = new KeyframeAnimation(keyframes);
            this.endPosition = end;

            this.moving = true;
        }
    }

    getRotateAngle(start, end){
        const diff = [end[0]-start[0], start[1]-end[1]];

        let rad = 0;

        if(diff[1] == 0) {
            if(diff[0] > 0) {
                rad = Math.PI/2;
            } 
            else {
                rad = -Math.PI/2;
            }
        }
        else if(diff[0] == 0) {
            if(diff[1] > 0) {
                rad = Math.PI;
            }
            else {
                rad = 0;
            }
        }

        else if(diff[1] > 0) {
            if(diff[0] > 0) {
                rad = Math.PI/2 + Math.PI/4;
            }
            else {
                rad = -Math.PI/2 - Math.PI/4;
            }
        }
        else {
            if(diff[0] > 0) {
                rad = Math.PI/4;
            }
            else {
                rad = -Math.PI/4;
            }
        }

        return rad*180/Math.PI;
    }

    isMoving(){
        return this.moving;
    }

    isInvisible(){
        return this.invisible;
    }

    makeVisible(){
        this.invisible = false;
    }

    makeInvisible(){
        this.invisible = true;
    }
}