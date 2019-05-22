var type = "";

Enemy = function (game, x, y, type) {

	Phaser.Sprite.call(this, game, x, y, 'spritesheet');

	//enables physics
	this.game.physics.p2.enable(this, false);

	this.type = type;

	//adds in the three types of shape animations
	this.animations.add("triangle", Phaser.Animation.generateFrameNames('triangle', 0, 2), 10, true, true);
	this.animations.add("square", Phaser.Animation.generateFrameNames('square', 0, 2), 10, true, true);
	this.animations.add("circle", Phaser.Animation.generateFrameNames('circle', 0, 2), 10, true, true);

	//plays the correct shape animation
	this.animations.play(type);

	//sets to correct size with correct bounds
	this.scale.x *= .18;
	this.scale.y *= .18;
	//gets rid of current bounding box
	this.body.clearShapes();
	if(type == "triangle"){
		//loads up the triangle physics
		this.body.loadPolygon("spritephysics", "triangle1");
	}
	
	else if(type == "square"){
		//loads up the triangle physics
		this.body.addRectangle(40, 37);
	}

	else{
		//loads up the triangle physics
		this.body.addCircle(20);
	}

	//moves the anchor point to the middle
	this.anchor.set(0.5);

	//adds the shape into the game
	this.body.angularDamping = .6;
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
	deathEmitter.setXSpeed(-300, 300);			
	deathEmitter.setYSpeed(-300, 300);			
	//start emitting 200 particles that disappear after 2000ms
	deathEmitter.start(true, 2000, null, 200);
	//loop through each particle and change it's tint to the color of the player's tint at time of death.
	deathEmitter.forEach(function(item){item.tint = this.tint;});
}
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {

}
