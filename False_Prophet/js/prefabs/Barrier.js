Barrier = function (game, x, y, angle) {

	Phaser.Sprite.call(this, game, x, y, 'barrier');

	//enables physics
	this.game.physics.p2.enable(this, false);

	//makes the barrier unable to move
	this.body.static = true;

	//changes the angle of the barrier
	this.body.angle = angle;

	//gets rid of current bounding box
	this.body.clearShapes();

	//adds a rectangle for p2 physics
	this.body.addRectangle(33, 250);

	//adds the shape into the game
	game.add.existing(this);

};
Barrier.prototype = Object.create(Phaser.Sprite.prototype);
Barrier.prototype.constructor = Barrier;

Barrier.prototype.update = function() {

}
