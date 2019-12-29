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
            
            this.material.apply();

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

    getRow(){
        return this.row;
    }

    getColumn(){
        return this.column;
    }

}