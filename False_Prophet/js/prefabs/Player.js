Player = function (game, x, y, key, frame){

	Phaser.Sprite.call(this, game, x, y, key, frame);

	this.anchor.set(0.5);

	game.physics.enable(this);
	this.body.collideWorldBounds = true;

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {

	this.body.velocity.x = 0;
	this.body.velocity.y = 0;

	if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
		this.body.velocity.y = -300;
		if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
			this.body.velocity.x = 300;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
			this.body.velocity.x = -300;
		}
	}
	else if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
		this.body.velocity.y = 300;
		if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
			this.body.velocity.x = 300;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
			this.body.velocity.x = -300;
		}
	}
	else if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
		this.body.velocity.x = 300;
	}
	else if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
		this.body.velocity.x = -300;
	}

}