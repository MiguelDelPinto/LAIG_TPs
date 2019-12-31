/**
 * MyPiece
 */
class MyPiece extends CGFobject {   
    constructor(scene, id, piece, row, column, material) {
        super(scene);

        this.id = id;    
        this.row = row;
        this.column = column;
        this.material = material;

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

    move(start, end){
        if(!this.invisible){
            const rotate = this.getRotateAngle(start, end);

            let keyframes = [
                {
                    'keyframeInstant': 0, 
                    'translateCoordinates': [0, 0, 0], 
                    'rotateAngles': [0, 0, 0],
                    'scaleCoordinates': [1, 1, 1]
                },
                {
                    'keyframeInstant': 0.5, 
                    'translateCoordinates': [0, 0, 0], 
                    'rotateAngles': [0, rotate, 0], //Rotate to target
                    'scaleCoordinates': [1, 1, 1]
                },
                {
                    'keyframeInstant': 1, 
                    'translateCoordinates': [(end[0]-start[0])/2, 2, (end[1]-start[1])/2],
                    'rotateAngles': [0, rotate, 0], //Rotate to target
                    'scaleCoordinates': [1, 1, 1]
                },
                {
                    'keyframeInstant': 1.5, 
                    'translateCoordinates': [end[0]-start[0], 0, end[1]-start[1]],
                    'rotateAngles': [0, rotate, 0], //Rotate to target
                    'scaleCoordinates': [1, 1, 1]
                },
                {
                    'keyframeInstant': 2, 
                    'translateCoordinates': [end[0]-start[0], 0, end[1]-start[1]],
                    'rotateAngles': [0, 0, 0], 
                    'scaleCoordinates': [1, 1, 1]
                }
            ];
            this.moveAnimation = new KeyframeAnimation(keyframes);
            this.endPosition = end;

            this.moving = true;
        }
    }

    getRotateAngle(start, end){
        const diff = [start[0]-end[0], start[1]-end[1]];
        const h = Math.sqrt(diff[0]*diff[0]+diff[1]*diff[1]);
        
        const x = diff[0]/h, y = diff[1]/h;

        const rad = (y > 0) ? Math.acos(x) : -Math.acos(x);
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