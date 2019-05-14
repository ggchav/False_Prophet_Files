var type = "";

Enemy = function (game, x, y, type) {

	Phaser.Sprite.call(this, game, x, y, 'spritesheet');

	//enables physics and colliding on the world bounds
	game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.type = type;
	//adds in the three types of shape animations
		this.animations.add("triangle", Phaser.Animation.generateFrameNames('triangle', 0, 2), 10, true, true);
	this.animations.add("square", Phaser.Animation.generateFrameNames('square', 0, 2), 10, true, true);
	this.animations.add("circle", Phaser.Animation.generateFrameNames('circle', 0, 2), 10, true, true);

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
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {

}
