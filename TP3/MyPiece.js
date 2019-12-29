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

        this.piece = piece || new MyFrog(scene, 'frog');

        this.selectAnimation = new JumpAnimation(x => {
            return 2 - 8*Math.pow(x - 0.5, 2);
        }, 1000);
    }

    display(){
        this.scene.pushMatrix();
            if(this.selected){
                this.selectAnimation.apply(this.scene);
            }
            
            this.material.apply();

            this.piece.display();
        this.scene.popMatrix();
    }

    select(){
        console.log("selected: " + this.row + "; " + this.column);
        this.selected = true;
        this.selectAnimation.resetsTime();
        this.selectAnimation.finishAnimation = false;
    }

    deselect(){
        console.log("deselected: " + this.row + "; " + this.column);
        this.selected = false;
    }
    
    update(t){
        if(this.selected){
            this.selectAnimation.update(t);
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

}