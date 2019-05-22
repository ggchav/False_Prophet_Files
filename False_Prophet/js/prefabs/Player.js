var shapeType = 'x';
var transformSound;
var cooldownDuration = 14; //includes the 8 seconds of disguise
var animateSpeed = 500; // 500 milliseconds
var disguiseDuration = 8; // 8 seconds
Player = function (game, x, y){
	
	Phaser.Sprite.call(this, game, x, y, 'spritesheet');
	transformSound = game.add.audio('transform');
	//enables p2 physics
	this.game.physics.p2.enable(this, false);

	//adds in the three types of shape animations
	this.animations.add("triangle", Phaser.Animation.generateFrameNames('triangle', 0, 2), 10, true, true);
	this.animations.add("square", Phaser.Animation.generateFrameNames('square', 0, 2), 10, true, true);
	this.animations.add("circle", Phaser.Animation.generateFrameNames('circle', 0, 2), 10, true, true);
	this.animations.add("x", Phaser.Animation.generateFrameNames('x', 0, 2), 10, true, true);

	//starts the player as an x sprite
	this.animations.play("x");

	//sets to correct size
	this.scale.x *= .28;
	this.scale.y *= .28;
	this.cooldownLeft = 0;
	this.disguiseLeft = 0;

	//gets rid of current bounding box
    this.body.clearShapes();

    //loads up the x physics
    this.body.loadPolygon("spritephysics", "x0");

	//moves the anchor point to the middle
	this.anchor.set(0.5);

	this.body.angularDamping = .6;
	this.body.damping = .6;

	//set player cooldownLeft for shape shifting
	this.cooldownLeft = 0;
    timer = game.time.create(false);
    animTimer = game.time.create(false);
    animTimer.loop(animateSpeed, this.animate, this);
	animTimer.start();
	this.animate();
	//adds the shape into the game
	game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.shapeType = function(){
	return shapeType;
}
Player.prototype.reset = function(animate){
	if (animate){
		this.createParticles(0x181818);
		transformSound.play();
	}
		shapeType = 'x';
		this.animations.play("x");
		this.body.clearShapes();
		this.body.loadPolygon("spritephysics", "x0");
	//
}
Player.prototype.startcooldownLeft = function(){
	this.cooldownLeft = cooldownDuration;
	this.disguiseLeft = disguiseDuration;
	this.tint = 0x181818;
	timer.loop(1000, this.updateTimer, this);
	timer.start();
	console.log("starting cooldownLeft...");
}
Player.prototype.updateTimer = function(){
	this.cooldownLeft --;
	this.disguiseLeft --;

	if (this.cooldownLeft <= 1){
		this.cooldownLeft = 0;
		timer.stop();
	}
	if (this.disguiseLeft == 0){
		this.reset(true);
	}	
}
Player.prototype.animate = function(){
	if (this.cooldownLeft <= 1){
		var newtint = Math.random() * 0xffffff;
		this.tweenTint(this, this.tint, newtint,animateSpeed);
		//console.log("animate function running");
	} else{
		this.tint = 0x181818;
	}
	//this.tint = Math.random() * 0xffffff;
	
}
Player.prototype.tweenTint = function(spriteobj, startColor, endColor, time) {    // create an object to tween with our step value at 0    
	var colorBlend = {step: 0};   
	// create the tween on this object and tween its step property to 100
	var colorTween = game.add.tween(colorBlend).to({step: 100}, time);        
	// run the interpolateColor function every time the tween updates, feeding it the   
	// updated value of our tween each time, and set the result as our tint   
	colorTween.onUpdateCallback(function() {spriteobj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);﻿});
	// set the object to the start color straight away
	
	// start the tween    
	colorTween.start();
}
Player.prototype.createParticles = function(color){
	//kills shapes when they collide
	deathEmitter = game.add.emitter(this.x, this.y, 100);
	deathEmitter.makeParticles(this.shapeType());
	//set particle properties including alpha, particle size and speed
	deathEmitter.setAlpha(0.3, 1);				
	deathEmitter.minParticleScale = 0.05;		
	deathEmitter.maxParticleScale = .25;
	deathEmitter.setXSpeed(-100 + this.body.velocity.x, 100 + this.body.velocity.x);			
	deathEmitter.setYSpeed(-100 + this.body.velocity.y, 100 + this.body.velocity.y);
	deathEmitter.gravity = 0;		
	//start emitting 200 particles that disappear after 2000ms
	deathEmitter.start(true, 1300, null, 50);
	deathEmitter.forEach(function(item){item.tint = color;});
	//loop through each particle and change it's tint to the color of the player's tint at time of death.
	
}

Player.prototype.update = function() {
	//initialize the player movement if not moving
	var playerSpeed = 270;
	//reset speed if not moving
	//this.body.velocity.x = 0;
	//this.body.velocity.y = 0;
	
	if (!player.destroyed){
	//Adds functionality for WASD movement
		if((game.input.keyboard.isDown(Phaser.Keyboard.W) && !(game.input.keyboard.isDown(Phaser.Keyboard.S))) || (!(game.input.keyboard.isDown(Phaser.Keyboard.W)) && game.input.keyboard.isDown(Phaser.Keyboard.S))){
			if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
				this.body.velocity.y = -playerSpeed;
			}
			else{
				this.body.velocity.y = playerSpeed;
			}
		}
		if((game.input.keyboard.isDown(Phaser.Keyboard.A) && !(game.input.keyboard.isDown(Phaser.Keyboard.D))) || (!(game.input.keyboard.isDown(Phaser.Keyboard.A)) && game.input.keyboard.isDown(Phaser.Keyboard.D))){
			if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
				this.body.velocity.x = -playerSpeed;
			}
			else{
				this.body.velocity.x = playerSpeed;
			}
		}

		//Adds functionality for changing between shapes with 123 keys
		var jKey = game.input.keyboard.addKey(Phaser.Keyboard.J);
		var kKey = game.input.keyboard.addKey(Phaser.Keyboard.K);
		var lKey = game.input.keyboard.addKey(Phaser.Keyboard.L);

		if(jKey.justDown && this.cooldownLeft <= 1){
				this.animations.play('triangle');

				//gets rid of current bounding box
    			this.body.clearShapes();

    			//loads up the triangle physics
    			this.body.loadPolygon("spritephysics", "triangle0");

				//this.tint = Phaser.Color.YELLOW;
				shapeType = 'triangle';
				transformSound.play();
				this.createParticles(0xFFFFFF);
				 //  Set a TimerEvent to occur after 1 seconds
				
   				this.startcooldownLeft();
		}
		else if(kKey.justDown && this.cooldownLeft <= 1){
				this.animations.play('circle');

				//gets rid of current bounding box
    			this.body.clearShapes();

    			//loads up the x physics
    			this.body.addCircle(32);

				//this.tint = Phaser.Color.RED;
				shapeType = 'circle';
				transformSound.play();
				this.createParticles(0xFFFFFF);

				this.startcooldownLeft();
		}
		else if(lKey.justDown && this.cooldownLeft <= 1){
				this.animations.play('square');

				//gets rid of current bounding box
    			this.body.clearShapes();

    			//loads up the x physics
    			this.body.addRectangle(63, 60);

				//this.tint = Phaser.Color.BLUE;
				shapeType = 'square';
				transformSound.play();
				this.createParticles(0xFFFFFF);

				this.startcooldownLeft();
			
		}
	}
}
