var shapeType = 'triangle';

Player = function (game, x, y){
	
	Phaser.Sprite.call(this, game, x, y, 'spritesheet');
	//enables physics and colliding on the world bounds
	game.physics.enable(this);
	this.body.collideWorldBounds = true;

	//adds in the three types of shape animations
	this.animations.add("triangle", Phaser.Animation.generateFrameNames('triangle', 0, 2), 10, true, true);
	this.animations.add("square", Phaser.Animation.generateFrameNames('square', 0, 2), 10, true, true);
	this.animations.add("circle", Phaser.Animation.generateFrameNames('circle', 0, 2), 10, true, true);

	//change to the x player later
	this.animations.play("triangle");
	this.tint = 0x847979;

	//sets to correct size with correct bounds
	this.scale.x *=.35;
	this.scale.y *=.35;
	this.body.setSize(200, 200);

	//moves the anchor point to the middle
	this.anchor.set(0.5);

	//adds the shape into the game
	game.add.existing(this);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.shapeType = function(){
	return shapeType;
}
Player.prototype.update = function() {
	//initialize the player movement if not moving
	var playerSpeed = 250;
	//reset speed if not moving
	this.body.velocity.x = 0;
	this.body.velocity.y = 0;
	if (!player.destroyed){
	//Adds functionality for WASD movement
		if((game.input.keyboard.isDown(Phaser.Keyboard.W) && !(game.input.keyboard.isDown(Phaser.Keyboard.S))) || (!(game.input.keyboard.isDown(Phaser.Keyboard.W)) && game.input.keyboard.isDown(Phaser.Keyboard.S))){
			if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
				this.body.velocity.y = -playerSpeed;
			}
			else{
				this.body.velocity.y = playerSpeed;
			}
		}
		if((game.input.keyboard.isDown(Phaser.Keyboard.A) && !(game.input.keyboard.isDown(Phaser.Keyboard.D))) || (!(game.input.keyboard.isDown(Phaser.Keyboard.A)) && game.input.keyboard.isDown(Phaser.Keyboard.D))){
			if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
				this.body.velocity.x = -playerSpeed;
			}
			else{
				this.body.velocity.x = playerSpeed;
			}
		}

		//Adds functionality for changing between shapes with 123 keys
		if(game.input.keyboard.isDown(Phaser.Keyboard.J)){
				this.animations.play('triangle');
				this.tint = 0xF2DD6E;
				shapeType = 'triangle';
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.K)){
				this.animations.play('circle');
				this.tint = 0xE5B25D;
				shapeType = 'circle';	
			}
			else if(game.input.keyboard.isDown(Phaser.Keyboard.L)){
					this.animations.play('square');
					this.tint = 0xCFF27E;
					shapeType = 'square';
			}
		}
}
