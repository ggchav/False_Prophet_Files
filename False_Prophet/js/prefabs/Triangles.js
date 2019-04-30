Triangles = function (game, x, y, key, frame) {

	Phaser.Sprite.call(this, game, x, y, key, frame);

	this.anchor.set(0.5);

	game.physics.enable(this);
	this.body.collideWorldBounds = true;

};

Triangle.prototype = Object.create(Phaser.Sprite.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.update = function() {

}