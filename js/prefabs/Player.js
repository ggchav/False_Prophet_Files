var shapeType=0;

Player = function (game, x, y){
	
	Phaser.Sprite.call(this, game, x, y, 'spritesheet', 'triangle');

	this.anchor.set(0.5);

	game.physics.enable(this);
	game.physics.arcade.enable(this);
	this.enableBody = true;
	this.body.collideWorldBounds = true;
	this.animations.add("triangle",[3,4,5], 10, true, true);
	this.animations.add("square",[0,1,2], 10, true, true);
	this.animations.add("circle",[6,7,8], 10, true, true);

	this.animations.play("triangle");
	this.anchor.set(0.5);
	this.scale.x *=.35;
	this.scale.y *=.35;
	
	this.body.collideWorldBounds = true;

	game.add.existing(this);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.shapeType = function(){
	return shapeType;
}
Player.prototype.update = function() {

	this.body.velocity.x = 0;
	this.body.velocity.y = 0;

	if((game.input.keyboard.isDown(Phaser.Keyboard.W) && !(game.input.keyboard.isDown(Phaser.Keyboard.S))) || (!(game.input.keyboard.isDown(Phaser.Keyboard.W)) && game.input.keyboard.isDown(Phaser.Keyboard.S))){
		if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
			this.body.velocity.y = -300;
		}
		else{
			this.body.velocity.y = 300;
		}
	}

	if((game.input.keyboard.isDown(Phaser.Keyboard.A) && !(game.input.keyboard.isDown(Phaser.Keyboard.D))) || (!(game.input.keyboard.isDown(Phaser.Keyboard.A)) && game.input.keyboard.isDown(Phaser.Keyboard.D))){
		if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
			this.body.velocity.x = -300;
		}
		else{
			this.body.velocity.x = 300;
		}
	}
	var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	if(spaceKey.justDown){
		//this.changeShape(); will make into function later
		shapeType++;
		if (shapeType > 2){
			shapeType = 0;
		}
		if (shapeType == 0){
			
			this.animations.play('triangle');
			this.tint = Phaser.Color.YELLOW;	
		}
		if (shapeType == 1){
			this.animations.play("square");
			this.tint = Phaser.Color.RED;
		}
		if (shapeType == 2) {
			this.animations.play('circle');
			this.tint = Phaser.Color.BLUE;
		}
	}

}
