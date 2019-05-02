Circles = function (game, x, y) {

	Phaser.Sprite.call(this, game, x, y, 'temp');

	this.anchor.set(0.5);

	game.physics.enable(this);
	this.body.collideWorldBounds = true;

	game.add.existing(this);

};

Circles.prototype = Object.create(Phaser.Sprite.prototype);
Circles.prototype.constructor = Circles;

Circles.prototype.update = function() {

}