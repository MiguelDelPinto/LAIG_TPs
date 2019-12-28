/**
 * MyLakeTile
 */
class MyLakeTile extends MyTile {   
    constructor(scene, id, tileObj) {
        super(scene, id);
        
        this.tileObj = tileObj;

        this.tileObj.setHighlightMaterial(this.highlightMaterial);
    }

    display(){
        if(this.highlighted){
            this.tileObj.highlight();
        }else{
            this.tileObj.playDown();
        }

        this.tileObj.display();
    }
}