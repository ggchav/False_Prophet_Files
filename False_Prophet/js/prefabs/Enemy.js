var type = "";

Enemy = function (game, x, y, type) {

	Phaser.Sprite.call(this, game, x, y, 'spritesheet');

	//enables physics and colliding on the world bounds
	game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.type = type;
	//adds in the three types of shape animations
	this.animations.add("triangle",[3,4,5], 10, true, true);
	this.animations.add("square",[0,1,2], 10, true, true);
	this.animations.add("circle",[6,7,8], 10, true, true);

	//plays the correct shape animation
	this.animations.play(type);

	//sets to correct size with correct bounds
	this.scale.x *=.22;
	this.scale.y *=.22;
	this.body.setSize(200, 200);

	//moves the anchor point to the middle
	this.anchor.set(0.5);

	//adds the shape into the game
	game.add.existing(this);

};

Enemy.prototype.shapeType = function(){
	return type;
}
Enemy.prototype.createParticles = function(){
	//kills shapes when they collide
	var deathEmitter = game.add.emitter(this.x, this.y, 100);
	deathEmitter.makeParticles(this.shapeType());
	//set particle properties including alpha, particle size and speed
	deathEmitter.setAlpha(0.3, 1);				
	deathEmitter.minParticleScale = 0.04;		
	deathEmitter.maxParticleScale = .13;
	deathEmitter.setXSpeed(-300,300);			
	deathEmitter.setYSpeed(-300,300);			
	//start emitting 200 particles that disappear after 2000ms
	deathEmitter.start(true, 2000, null, 200);
	//loop through each particle and change it's tint to the color of the player's tint at time of death.
	deathEmitter.forEach(function(item){item.tint = this.tint;});
}
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {

}
