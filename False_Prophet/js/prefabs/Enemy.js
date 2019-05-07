var type = 0;

Enemy = function (game, x, y, type) {

	Phaser.Sprite.call(this, game, x, y, 'spritesheet', type+0);

	this.anchor.set(0.5);

	game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.animations.add("triangle",[3,4,5], 10, true, true);
	this.animations.add("square",[0,1,2], 10, true, true);
	this.animations.add("circle",[6,7,8], 10, true, true);

	this.animations.play(type);
	this.anchor.set(0.5);
	this.scale.x *=.35;
	this.scale.y *=.35;
	
	this.body.collideWorldBounds = true;

	game.add.existing(this);

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;


Enemy.prototype.shapeType = function(){
	return type;
}

Enemy.prototype.update = function() {

}
