var shapeType = 'triangle';
var shapeCooldown=0;
Player = function (game, x, y){
	
	Phaser.Sprite.call(this, game, x, y, 'spritesheet');
	//enables physics and colliding on the world bounds
	game.physics.enable(this);
	this.body.collideWorldBounds = true;
	//this.shapetype = 'triangle'
	//adds in the three types of shape animations
	this.animations.add("triangle",[3,4,5], 10, true, true);
	this.animations.add("square",[0,1,2], 10, true, true);
	this.animations.add("circle",[6,7,8], 10, true, true);

	//change to the x player later
	this.animations.play("triangle");
	this.tint = Phaser.Color.YELLOW;

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
Player.prototype.reset = function(){
	shapeType = 'triangle';
}
Player.prototype.createParticles = function(){
	//kills shapes when they collide
	deathEmitter = game.add.emitter(this.x, this.y, 100);
	deathEmitter.makeParticles(this.shapeType());
	//set particle properties including alpha, particle size and speed
	deathEmitter.setAlpha(0.3, 1);				
	deathEmitter.minParticleScale = 0.05;		
	deathEmitter.maxParticleScale = .25;
	deathEmitter.setXSpeed(-100+this.body.velocity.x,100+this.body.velocity.x);			
	deathEmitter.setYSpeed(-100+this.body.velocity.y,100+this.body.velocity.y);
	deathEmitter.gravity =0;		
	//start emitting 200 particles that disappear after 2000ms
	deathEmitter.start(true, 1300, null, 50);
	//loop through each particle and change it's tint to the color of the player's tint at time of death.
	
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
		var jKey = game.input.keyboard.addKey(Phaser.Keyboard.J);
		var kKey = game.input.keyboard.addKey(Phaser.Keyboard.K);
		var lKey = game.input.keyboard.addKey(Phaser.Keyboard.L);

		if(jKey.justDown && shapeCooldown == 0){
				this.animations.play('triangle');
				this.tint = Phaser.Color.YELLOW;
				shapeType = 'triangle';
				this.createParticles();
		}
		else if(kKey.justDown && shapeCooldown == 0){
				this.animations.play('circle');
				this.tint = Phaser.Color.RED;
				shapeType = 'circle';
				this.createParticles();
				
				
		}
		else if(lKey.justDown && shapeCooldown == 0){
				this.animations.play('square');
				this.tint = Phaser.Color.BLUE;
				shapeType = 'square';
				this.createParticles();
				//this.cooldown = 0;

		}
	}
}
