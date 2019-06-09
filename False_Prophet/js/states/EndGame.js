//declare some global variables
var player;
var triangle = [];
var square= [];
var circle= [];
var barrier;
var music;
var levelcomplete;
var bottomtext;
var enemycount = 4;
var alive;
//create a shape array that represents the remaining shapes alive, and a counter for each shape
var triangleCollisionGroup;
var squareCollisionGroup;
var circleCollisionGroup;
var playerCollisionGroup;
var barrierCollisionGroup;
var types = ['triangle','circle','square'];
//audio array for each sound type
var flee = new Array();
var anger = new Array();
var follow = new Array();
var poofArray = new Array();

var EndGame = function(game){};

EndGame.prototype = {

	create: function() {
		//set the bounds of the level
		game.world.setBounds(0, 0, 1000, 1000);

		//load sounds into arrays
		for (i = 1; i < 6; i++){
			 flee[i-1] = game.add.audio("flee"+i);
			 anger[i-1] = game.add.audio("anger"+i);
			 follow[i-1] = game.add.audio("follow"+i);
		}
		for (i = 0; i < 3; i++){
			poofArray[i] = game.add.audio("poof"+i);
		}

		//starts up the p2 physics
		game.physics.startSystem(Phaser.Physics.P2JS);

		//turn on impact events for the world, without this we get no collision callbacks
    	game.physics.p2.setImpactEvents(true);
    	alive = {wincondition:0,triangle:enemycount,circle:enemycount,square:enemycount}
    	//creates p2 collsion groups
    	playerCollisionGroup = game.physics.p2.createCollisionGroup();
    	triangleCollisionGroup = game.physics.p2.createCollisionGroup();
    	squareCollisionGroup = game.physics.p2.createCollisionGroup();
    	circleCollisionGroup = game.physics.p2.createCollisionGroup();
    	barrierCollisionGroup = game.physics.p2.createCollisionGroup();
		
		//initialize the tilesprite for the background
		background = game.add.tileSprite(0, 0, 700, 700, 'background');
		
		// add music if it's not already playing/loaded
		if (!music){
			music = game.add.audio('music');
		}

		// add music if it's not already playing
		if (!music.isPlaying){
			//music.play(null, 0,.37,true);
		}

		//create the player from the prefab
		player = new Player(game, 500, 500, 1, 1,40);

		//reset player shape type
		player.reset(false);

		//declaring the player as a part of a collision type
		player.body.setCollisionGroup(playerCollisionGroup);

		//declare a death emitter so that function can later call it with new params easily
		deathEmitter = game.add.emitter(player.x, player.y, 100);

		//fix the camera with the background and make it follow the player
		background.fixedToCamera = true;

		//adds an overlay to the game and scales
		overlay = game.add.image(0, 0, 'overlay');
		overlay.scale.x = .7;
		overlay.scale.y = .7;

		//fixes the overlay to the camera
		overlay.fixedToCamera = true;

		//makes the camera follow the player
		game.camera.follow(player);
		game.camera.scale.x = 2;
		game.camera.scale.y = 2;

		//declares all barriers used for the level
		var step = 2*Math.PI/30;
		var h = 500; 
		var k = 500;
		var r = 210;
		var i = 0;
		//spawn a bunch of angry circles squares and triangles around the player
		for(var theta=0;  theta < 2*Math.PI;  theta+=step)
		{ 	
			var x = h + r*Math.cos(theta);
			var y = k - r*Math.sin(theta);    //note 2.
			var rng = [];
			var rngtype = [];
			rng[0] = (Math.random()*5);
			rng[1] = 5+(Math.random()*10);
			rng[2] = 5+(Math.random()*10);
			rngtype[0] =  Phaser.ArrayUtils.getRandomItem(types);
			rngtype[1] =  Phaser.ArrayUtils.getRandomItem(types);
			rngtype[2] =  Phaser.ArrayUtils.getRandomItem(types);
			triangle[i] = new Enemy(game, x+rng[0],y-rng[0], rngtype[0]);
			circle[i] = new Enemy(game, x+rng[1],y+rng[1], rngtype[1]);
			square[i] = new Enemy(game, x-rng[2],y-rng[2], rngtype[2]);
			triangle[i].body.setCollisionGroup(triangleCollisionGroup);
			circle[i].body.setCollisionGroup(circleCollisionGroup);
			square[i].body.setCollisionGroup(squareCollisionGroup);
			// be aware that this is passing the body1 and body2, not the actual enemy

			triangle[i].body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup, barrierCollisionGroup]);
			circle[i].body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup, barrierCollisionGroup]);
			square[i].body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup, barrierCollisionGroup]);
			i++;
		}
	
		// Working player collision but annoying for testing purposes so I recommend turning off to prevent dying
		player.body.collides([triangleCollisionGroup,squareCollisionGroup,circleCollisionGroup], this.killPlayer, this);

		//used for player collisions with barriers
		player.body.collides(barrierCollisionGroup);

		//neccessary for the collisions of p2
		game.physics.p2.updateBoundsCollisionGroup();

		levelcomplete = game.add.text(game.width/2, 100, 'Divided we are weak...', {font: '30px Arial', fill: '#ffffff'});
		levelcomplete.anchor.setTo(.5);
		levelcomplete.fixedToCamera = true;
		bottomtext = game.add.text(game.width/2, 200, 'Together, we are strong.', {font: '30px Arial', fill: '#ffffff'});
		bottomtext.anchor.setTo(.5);
		bottomtext.fixedToCamera = true;
		bottomtext.alpha = 0;
		levelcomplete.alpha = 0;
		//game.time.events.add(2000, function() { game.add.tween(levelcomplete).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);}, this);
		game.time.events.add(Phaser.Timer.SECOND * 1.5, function() { game.add.tween(levelcomplete).to({alpha:1}, 1500).start(); });
		game.time.events.add(Phaser.Timer.SECOND * 4, function() { game.add.tween(bottomtext).to({alpha:1}, 1500).start(); });
		
	},

	update: function() {
	// checks if player is destroyed before running these
		//cheatcodes for testings
	var pKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
	if (pKey.justDown){
		this.nextLevel();
	}
		if (!player.destroyed){
			//follows though the different shape/player interactions
			//(shape, same, weak, strong)
			// console.log('player is not destroyed, shape movement should run.');
			this.shapeMovement(triangle, 'triangle', 'circle', 'square');
			this.shapeMovement(circle, 'circle', 'square', 'triangle');
			this.shapeMovement(square, 'square', 'triangle', 'circle');

			//instructions for the camera to stay on the screen
			if (!game.camera.atLimit.x){
	        	background.tilePosition.x -= (player.body.velocity.x * game.time.physicsElapsed);
			}
			if (!game.camera.atLimit.y){
	        	background.tilePosition.y -= (player.body.velocity.y * game.time.physicsElapsed);
			}
		}

		//For seperating similar shapes
		//particle effect fades in opacity towards 0 as it's lifespan approaches 0.
		deathEmitter.forEachAlive(function(p){p.alpha = p.lifespan / deathEmitter.lifespan; });
		
		//not a great solution, but if player is always set to the collide, changing the body type and shape won't phase it
		player.body.setCollisionGroup(playerCollisionGroup);
		game.world.bringToTop(overlay);

		//brings the cooldown text to the top of the screen and moves it

		game.world.bringToTop(cooldown);
    	levelcomplete.cameraOffset.setTo(game.width/2, 200);
    	bottomtext.cameraOffset.setTo(game.width/2, 500);
		game.world.bringToTop(levelcomplete);
		game.world.bringToTop(bottomtext);
		
		
	},
	shapeMovement: function(type, same, weak, strong){
		//repeat for the provided shape
		//console.log('player.shapeType() = '+player.shapeType());
		type.forEach( enemyloop = function(enemy){
			//how quickly a shape runs away
			var fleeSpeed = 190;
			//how quickly a shape runs toward the player aggresively
			var angerSpeed = 9;
			//how quickly a shape follows the player
			var followSpeed = 150;
			//how close a shape has to be to "see" the player shape and react
			var sightRange = 420;
			//the approximate proximity following shapes will go before they stop moving toward player
			var followDist = 200;
			//how quickly enemy color changes to reflect how the feel about your shape type
			var enemyTweenSpeed = 600;
			//shorthand to make it easier to refer to the distance between shape vs player
			var playerShapeDist = Phaser.Math.distance(player.body.x, player.body.y, enemy.body.x, enemy.body.y);
			//withinSightRange bool returns true if a shape can see a player
			var shapeCanSeePlayer = playerShapeDist <= sightRange;
			if (!shapeCanSeePlayer){
				enemy.tint = Phaser.Color.WHITE;
			}
			//variable to set volume to play sound effect at, increases value with proximity
			var soundVol = (sightRange - playerShapeDist) /1000;
			if (soundVol > .6){
					soundVol = .6;
				}
			// defined function shapeSound inside here, because it's only used here and I couldn't find an easy way to access it from inside the enemy foreach loop
			function shapeSound(typeArray){
				//how many sounds that can play at once of this type
				var maxSounds = 2;
				//bool flag that prevents tons of sounds from playing at once
				var maxPlaying = false;
				//counts the sounds playing to track maxSound limit
				var counter = 0;
				var rng = Math.floor(Math.random() * 5);
				for (i=0; i<5; i++){
					if (typeArray[i].isPlaying == true){
						counter ++;
						//tween sound to not abruptly adjust to the distance the shape is from player
						game.add.tween(typeArray[i].volume).to({volume:soundVol}, 500).start();
					}
				}
				//only play sound if max amount of audio isn't playing using maxPlaying bool 
				if (counter >= maxSounds){
					maxPlaying = true;
				}
				var rng = Math.floor(Math.random()*5);
				if (!maxPlaying){
					//calls the sound array for that sound type[picksrandom] play passes soundVol
					typeArray[rng].play(null, 0, soundVol, false, false);
				}	
			}

			function tweenTint(spriteobj, startColor, endColor, time) {    // create an object to tween with our step value at 0    
				var colorBlend = {step: 0};   
				// create the tween on this object and tween its step property to 100
				var colorTween = game.add.tween(colorBlend).to({step: 100}, time);        
				// run the interpolateColor function every time the tween updates, feeding it the   
				// updated value of our tween each time, and set the result as our tint   
				colorTween.onUpdateCallback(function() {spriteobj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);﻿});
				// start the tween    
				colorTween.start();
				
			}
				if(shapeCanSeePlayer){
					shapeSound(anger);
					enemy.tint = Phaser.Color.RED;
					//tweenTint(enemy, enemy.tint, Phaser.Color.RED, enemyTweenSpeed);
					var dx = player.body.x - enemy.x;
       				var dy = player.body.y - enemy.y;
       				var angle = Math.atan2(dy, dx) + game.math.degToRad(-90) + (Math.PI / 2);
       				enemy.body.velocity.x = angerSpeed * Math.cos(angle);
					enemy.body.velocity.y = angerSpeed * Math.sin(angle);
				}
				else{
					enemy.body.velocity.x = 0;
					enemy.body.velocity.y = 0;
				}
       	});
	},
	createParticles: function(shape, enemyBool){
		//kills shapes when they collide
		deathEmitter = game.add.emitter(shape.x, shape.y, 100);
		//if the passed shape is an enemy, enemy bool is true
		var size = 1;
		var spread = 1;
		if (!enemyBool){
			deathEmitter.makeParticles(shape.shapeType());
		}
		else{
			deathEmitter.makeParticles('spritesheet', ['smoke']);
			size = 3;
			spread = .7;
		}
		//set particle properties including alpha, particle size and speed
		deathEmitter.setAlpha(0.3, 1*spread);				
		deathEmitter.minParticleScale = 0.04;		
		deathEmitter.maxParticleScale = .13*size;
		var speed = 200 * spread;
		deathEmitter.setXSpeed(-speed,speed);			
		deathEmitter.setYSpeed(-speed,speed);			
		//start emitting 150 particles that disappear after 1500ms
		deathEmitter.start(true, 1500, null, 150);
		//loop through each particle and change it's tint to the color of the player's tint at time of death.
		deathEmitter.forEach(function(item){item.tint = shape.tint;});
	},
	killPlayer: function(playershape, enemyshape){
		//kills the player when collided with any shape
		this.createParticles(player, false);
		player.animations.stop();
		var rng = Math.floor(Math.random()*3);
		poofArray[rng].play(null, 0, 1, false, false);
		player.destroyed = true;
		player.kill();
		//player.destroy();
		//restarts the level after we see the particle explosion of the player
		//game.state.clearCurrentState();
		game.time.events.add(Phaser.Timer.SECOND * 3, this.nextLevel());
	},
	shutdown: function(){
		player = new Player(game, 500, 1000, 9, 5);
	},
		nextLevel: function(){
		window.location.reload(false); 
	}
}