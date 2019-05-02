Player = function (game, x, y){

	Phaser.Sprite.call(this, game, x, y, 'temp');

	this.anchor.set(0.5);

	game.physics.enable(this);
	this.body.collideWorldBounds = true;

	game.add.existing(this);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {

	this.body.velocity.x = 0;
	this.body.velocity.y = 0;

	if((game.input.keyboard.isDown(Phaser.Keyboard.W) && !(game.input.keyboard.isDown(Phaser.Keyboard.S))) || (!(game.input.keyboard.isDown(Phaser.Keyboard.W)) && game.input.keyboard.isDown(Phaser.Keyboard.S))){
		if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
			this.body.velocity.y = -300;
		}
		else{
			this.body.velocity.y = 300;
		}
	}

	if((game.input.keyboard.isDown(Phaser.Keyboard.A) && !(game.input.keyboard.isDown(Phaser.Keyboard.D))) || (!(game.input.keyboard.isDown(Phaser.Keyboard.A)) && game.input.keyboard.isDown(Phaser.Keyboard.D))){
		if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
			this.body.velocity.x = -300;
		}
		else{
			this.body.velocity.x = 300;
		}
	}

}