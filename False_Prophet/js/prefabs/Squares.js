Squares = function (game, x, y, key, frame) {

	Phaser.Sprite.call(this, game, x, y, key, frame);

	this.anchor.set(0.5);

	game.physics.enable(this);
	this.body.collideWorldBounds = true;

};

Squares.prototype = Object.create(Phaser.Sprite.prototype);
Squares.prototype.constructor = Squares;

Squares.prototype.update = function() {

}