Circles = function (game, x, y, key, frame) {

	Phaser.Sprite.call(this, game, x, y, key, frame);

	this.anchor.set(0.5);

	game.physics.enable(this);
	this.body.collideWorldBounds = true;

};

Circles.prototype = Object.create(Phaser.Sprite.prototype);
Circles.prototype.constructor = Circles;

Circles.prototype.update = function() {

}