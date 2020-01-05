/**
* GameOverMessage
* @constructor
* @param scene - Reference to MyScene object
*/
class GameOverMessage extends CGFobject {
    constructor(scene, winner, player, board) {
        super(scene);
        this.scene = scene;

        this.rectangle1 = new MyRectangle(scene, '1', -0.5, 0.5, 0.5, 0.75);
        this.rectangle2 = new MyRectangle(scene, '2', -0.25, 0.1, 0.25, 0.5);
        this.rectangle3 = new MyRectangle(scene, '3', 0.15, 0.25, 0.25, 0.5);
        this.rectangle4 = new MyRectangle(scene, '4', -0.6, 0.6, 0, 0.25);
        this.rectangle5 = new MyRectangle(scene, '5', -0.6, -0.1, -0.4, -0.15);
        this.rectangle6 = new MyRectangle(scene, '6', 0.1, 0.6, -0.4, -0.15);
        
        this.winner = winner;
        this.player = player;
        this.lake = board instanceof MyLake;

        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(0.2, 0.2, 0.2, 1);
        this.material.setDiffuse(0.6, 0.6, 0.6, 1);
        this.material.setSpecular(0.1, 0.1, 0.1, 1);
        this.material.setShininess(1.0);

        switch(this.winner){
            case 1:
                this.player_number_texture = new CGFtexture(this.scene, 'scenes/images/1.png');
                 
                this.colorMaterial = new CGFappearance(this.scene);
                this.colorMaterial.setAmbient(0.125, 0.5, 0.5, 1);
                this.colorMaterial.setDiffuse(0.125, 0.5, 0.5, 1);
                this.colorMaterial.setSpecular(0.025, 0.1, 0.1, 0.1);
                this.colorMaterial.setShininess(1.0);
                this.colorMaterial.setTextureWrap('REPEAT', 'REPEAT');
                break;
            case 2:
                this.player_number_texture = new CGFtexture(this.scene, 'scenes/images/2.png');
                
                this.colorMaterial = new CGFappearance(this.scene);
                this.colorMaterial.setAmbient(0.5, 0.5, 0.125, 1);
                this.colorMaterial.setDiffuse(0.5, 0.5, 0.125, 1);
                this.colorMaterial.setSpecular(0.1, 0.1, 0.025, 0.1);
                this.colorMaterial.setShininess(1.0);
                this.colorMaterial.setTextureWrap('REPEAT', 'REPEAT');
                break;
            default:
                break;
        }

        this.initTextures();
        this.initShaders();
    }

    initTextures(){
        this.congratulations_texture = new CGFtexture(this.scene, 'scenes/images/congratulations.png');
        this.player_texture = new CGFtexture(this.scene, 'scenes/images/player.png');
        this.win_game_texture = new CGFtexture(this.scene, 'scenes/images/win_game.png');
        this.main_menu_texture = new CGFtexture(this.scene, 'scenes/images/main_menu.png');
        this.play_video_texture = new CGFtexture(this.scene, 'scenes/images/play_video.png');
    }

    initShaders(){
        this.shader = new CGFshader(
            this.scene.gl,
            "shaders/ui.vert",
            "shaders/ui.frag"
        );
        
        this.shader.setUniformsValues({texture: 0});
        this.shader.setUniformsValues({player: this.winner});
    }

    display() {
        this.scene.clearPickRegistration();

        this.scene.setActiveShader(this.shader);
            this.shader.setUniformsValues({player: this.winner});
            this.congratulations_texture.bind(0);
            this.rectangle1.display();
            this.congratulations_texture.unbind(0);

            this.player_texture.bind(0);
            this.rectangle2.display();
            this.player_texture.unbind(0);

            this.player_number_texture.bind(0);
            this.rectangle3.display();
            this.player_number_texture.unbind(0);
        
            this.win_game_texture.bind(0);
            this.rectangle4.display();
            this.win_game_texture.unbind(0);
            this.scene.setActiveShader(this.scene.defaultShader);
            
            this.material.apply();

            this.scene.registerForPick(1001, this.rectangle5);
            this.scene.pushMatrix();
                if(this.lake){
                    if(this.player === 1){
                        this.scene.translate(0, 0, 17.5);
                    }
                    else{
                        this.scene.translate(0, 0, -17.5);
                    }
                    this.scene.scale(1.2, 1.2, 1.2);
                }
                if(this.player === 2){
                    this.scene.rotate(Math.PI, 0, 1, 0);
                }
                this.scene.translate(0, 0, 2.5);
                this.scene.rotate(-Math.PI/3, 1, 0, 0);
                this.scene.scale(7, 5, 10);
                this.rectangle5.display();
            this.scene.popMatrix();

            this.colorMaterial.setTexture(this.main_menu_texture);
            this.colorMaterial.apply();
            this.scene.pushMatrix();
                if(this.lake){
                    if(this.player === 1){
                        this.scene.translate(0, 0, 17.5);
                    }
                    else{
                        this.scene.translate(0, 0, -17.5);
                    }
                    this.scene.scale(1.2, 1.2, 1.2);
                }
                if(this.player === 2){
                    this.scene.rotate(Math.PI, 0, 1, 0);
                }
                this.scene.translate(0, 0, 2.5);
                this.scene.rotate(-Math.PI/3, 1, 0, 0);
                this.scene.scale(7, 5, 10);
                this.rectangle5.display();
            this.scene.popMatrix();

            this.scene.clearPickRegistration();
            
            this.material.apply();

            this.scene.registerForPick(1002, this.rectangle6);
            this.scene.pushMatrix();
                if(this.lake){
                    if(this.player === 1){
                        this.scene.translate(0, 0, 17.5);
                    }
                    else{
                        this.scene.translate(0, 0, -17.5);
                    }
                    this.scene.scale(1.2, 1.2, 1.2);
                }
                if(this.player === 2){
                    this.scene.rotate(Math.PI, 0, 1, 0);
                }
                this.scene.translate(0, 0, 2.5);
                this.scene.rotate(-Math.PI/3, 1, 0, 0);
                this.scene.scale(7, 5, 10);
                this.rectangle6.display();
            this.scene.popMatrix();

            this.colorMaterial.setTexture(this.play_video_texture);
            this.colorMaterial.apply();

            this.scene.pushMatrix();
                if(this.lake){
                    if(this.player === 1){
                        this.scene.translate(0, 0, 17.5);
                    }
                    else{
                        this.scene.translate(0, 0, -17.5);
                    }
                    this.scene.scale(1.2, 1.2, 1.2);
                }
                if(this.player === 2){
                    this.scene.rotate(Math.PI, 0, 1, 0);
                }
                this.scene.translate(0, 0, 2.5);
                this.scene.rotate(-Math.PI/3, 1, 0, 0);
                this.scene.scale(7, 5, 10);
                this.rectangle6.display();
            this.scene.popMatrix();
            
            this.scene.clearPickRegistration();

    }

    updateTexCoords(length_s, length_t) {}
}