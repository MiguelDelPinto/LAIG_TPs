/**
* GameOverMessage
* @constructor
* @param scene - Reference to MyScene object
*/
class GameOverMessage extends CGFobject {
    constructor(scene, winner) {
        super(scene);
        this.scene = scene;

        this.rectangle1 = new MyRectangle(scene, '1', -0.5, 0.5, 0.5, 0.75);
        this.rectangle2 = new MyRectangle(scene, '2', -0.25, 0.1, 0.25, 0.5);
        this.rectangle3 = new MyRectangle(scene, '3', 0.15, 0.25, 0.25, 0.5);
        this.rectangle4 = new MyRectangle(scene, '4', -0.6, 0.6, 0, 0.25);
        this.rectangle5 = new MyRectangle(scene, '5', -0.6, -0.1, -0.4, -0.15);
        this.rectangle6 = new MyRectangle(scene, '6', 0.1, 0.6, -0.4, -0.15);
        
        this.winner = winner;

        switch(this.winner){
            case 1:
                this.player_number_texture = new CGFtexture(this.scene, 'scenes/images/1.png');
                break;
            case 2:
                this.player_number_texture = new CGFtexture(this.scene, 'scenes/images/2.png');
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
            
            this.shader.setUniformsValues({player: 0});

            this.scene.registerForPick(1001, this.rectangle5);
            this.rectangle5.display();
            this.scene.clearPickRegistration();

            this.scene.registerForPick(1002, this.rectangle6);
            this.rectangle6.display();
            this.scene.clearPickRegistration();

            this.shader.setUniformsValues({player: this.winner});

            this.main_menu_texture.bind(0);
            this.scene.registerForPick(1001, this.rectangle5);
            this.rectangle5.display();
            this.scene.clearPickRegistration();
            this.main_menu_texture.unbind(0);

            this.play_video_texture.bind(0);
            this.scene.registerForPick(1002, this.rectangle6);
            this.rectangle6.display();
            this.scene.clearPickRegistration();
            this.play_video_texture.unbind(0);

        this.scene.setActiveShader(this.scene.defaultShader);
    }

    updateTexCoords(length_s, length_t) {}
}