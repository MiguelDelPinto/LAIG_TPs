/**
 * MyPiece
 */
class MyPiece extends CGFobject {   
    constructor(scene, id, piece) {
        super(scene);

        this.id = id;    

        this.selected = false;

        this.piece = piece || new MyFrog(scene, 'frog');

        this.selectAnimation = new JumpAnimation(x => {
            return 2 - 8*Math.pow(x - 0.5, 2);
        }, 1000);
    }

    display(){
        this.scene.pushMatrix();
            if(this.select){
                this.selectAnimation.apply(this.scene);
            }
            this.piece.display();
        this.scene.popMatrix();
    }

    select(){
        this.selected = true;
        this.frogAnimation.resetsTime();
        this.frogAnimation.finishAnimation = false;
    }

    deselect(){
        this.select = false;
    }
    
    update(t){
        if(this.selected){
            this.selectAnimation.update(t);
        }
    }

}