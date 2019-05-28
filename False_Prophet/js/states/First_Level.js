//declare some global variables
var player;
var triangle = [];
var square= [];
var circle= [];
var barrier;
var music;
var cooldown;

//creates collisionc groups for p2 interactions
var triangleCollisionGroup;
var squareCollisionGroup;
var circleCollisionGroup;
var playerCollisionGroup;
var barrierCollisionGroup;

//audio array for each sound type
var flee = new Array();
var anger = new Array();
var follow = new Array();
var poofArray = new Array();

var First_Level = function(game){};

First_Level.prototype = {

	create: function() {
		//set the bounds of the level
		game.world.setBounds(0, 0, 2000, 2000);

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
			music.play(null, 0,.65,true);
		}

		//create the player from the prefab
		player = new Player(game, 500, 1000, 5, 8);

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

		//declares all barriers used for the level
		for (i = 0; i < 2; i++){
			barrier = new Barrier(game, 800 + (i * 1000), 500, 0);
			barrier.body.setCollisionGroup(barrierCollisionGroup);
			barrier.body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);
			barrier = new Barrier(game, 935 + (i * 730), 390, 90);
			barrier.body.setCollisionGroup(barrierCollisionGroup);
			barrier.body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);

			barrier = new Barrier(game, 800 + (i * 1000), 1500, 0);
			barrier.body.setCollisionGroup(barrierCollisionGroup);
			barrier.body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);
			barrier = new Barrier(game, 935 + (i * 730), 1610, 90);
			barrier.body.setCollisionGroup(barrierCollisionGroup);
			barrier.body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);

			barrier = new Barrier(game, 1300, 390 + (i * 605), 90);
			barrier.body.setCollisionGroup(barrierCollisionGroup);
			barrier.body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);

			barrier = new Barrier(game, 500, 800 + (i * 400), 0);
			barrier.body.setCollisionGroup(barrierCollisionGroup);
			barrier.body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);

		}

		//creates enemies from prefabs and adds them to their collision group while assigning collision attributes
		for (i = 0; i < 4; i++){
			triangle[i] = new Enemy(game, 1650, 450 + (i * 50), 'triangle');
			circle[i] = new Enemy(game, 1650, 1400 + (i * 50), 'circle');
			square[i] = new Enemy(game, 1100, 920 + (i * 50), 'square');

			triangle[i].body.setCollisionGroup(triangleCollisionGroup);
			circle[i].body.setCollisionGroup(circleCollisionGroup);
			square[i].body.setCollisionGroup(squareCollisionGroup);

			triangle[i].body.collides(squareCollisionGroup, this.killShape, this);
			circle[i].body.collides(triangleCollisionGroup, this.killShape, this);
			square[i].body.collides(circleCollisionGroup, this.killShape, this);

			triangle[i].body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup, barrierCollisionGroup]);
			circle[i].body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup, barrierCollisionGroup]);
			square[i].body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup, barrierCollisionGroup]);
	
		}
	
		// Working player collision but annoying for testing purposes so I recommend turning off to prevent dying
		player.body.collides([triangleCollisionGroup,squareCollisionGroup,circleCollisionGroup], this.killPlayer, this);

		//used for player collisions with barriers
		player.body.collides(barrierCollisionGroup);

		//neccessary for the collisions of p2
		game.physics.p2.updateBoundsCollisionGroup();

		//adds the cooldown text to the game
		cooldown = game.add.text(game.width/2, 600, '0', {font: '30px Arial', fill: '#ffffff'});
		cooldown.anchor.setTo(.5);

	},

	update: function() {
	// checks if player is destroyed before running these
		if (!player.destroyed){
			//follows though the different shape/player interactions
			//(shape, same, weak, strong)
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
		cooldown.fixedToCamera = true;
    	cooldown.cameraOffset.setTo(game.width/2, game.height - 18);
		game.world.bringToTop(cooldown);

		//changes the text of the cooldown dependant on the player's state
		if (player.cooldownLeft < .1){
			cooldown.alpha = 0;
		}
		else{
			cooldown.alpha = 1;
		}
		if (player.disguiseLeft < 1){
			cooldown.setText("Redisguise available in " + player.cooldownLeft);
		}
		else{
			cooldown.setText("Disguise disappears in " + player.disguiseLeft);
		}
		
		
		
	},
	shapeMovement: function(type, same, weak, strong){
		//repeat for the provided shape
		type.forEach( enemyloop = function(enemy){
			//how quickly a shape runs away
			var fleeSpeed = 220;
			//how quickly a shape runs toward the player aggresively
			var angerSpeed = 290;
			//how quickly a shape follows the player
			var followSpeed = 150;
			//how close a shape has to be to "see" the player shape and react
			var sightRange = 400;
			//the approximate proximity following shapes will go before they stop moving toward player
			var followDist = 200;
			//how quickly enemy color changes to reflect how the feel about your shape type
			var enemyTweenSpeed = 600;
			//shorthand to make it easier to refer to the distance between shape vs player
			var playerShapeDist = Phaser.Math.distance(player.body.x, player.body.y, enemy.body.x, enemy.body.y);
			//withinSightRange bool returns true if a shape can see a player
			var shapeCanSeePlayer = playerShapeDist <= sightRange;
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
			//shape follows the player if the are the same shape, never getting too close
       		if (player.shapeType() == same){
       			if (shapeCanSeePlayer){
       				shapeSound(follow);
       				//tween enemy color to be the follow color
       				enemy.tint= Phaser.Color.GREEN;
       				//tweenTint(enemy, enemy.tint, Phaser.Color.GREEN, enemyTweenSpeed);
       				if (playerShapeDist >= 120){
						var dx = player.body.x - enemy.x;
       					var dy = player.body.y - enemy.y;
       					var angle = Math.atan2(dy, dx) + game.math.degToRad(-90) + (Math.PI / 2);
       					enemy.body.velocity.x = followSpeed * Math.cos(angle);
						enemy.body.velocity.y = followSpeed * Math.sin(angle);
       				}
					else{
						enemy.body.velocity.x = 0;
						enemy.body.velocity.y = 0;
					}
       			}

			}
			//shape runs away from the player
			else if (player.shapeType() == weak){
				if(shapeCanSeePlayer){
       				shapeSound(flee);
					enemy.tint= Phaser.Color.YELLOW;
       				//tweenTint(enemy, enemy.tint, Phaser.Color.YELLOW, enemyTweenSpeed);
					//changes fleespeed if closer to the player
					if(playerShapeDist <= 150){
						fleeSpeed = fleeSpeed * 1.8;
					}
					//moves the enemy appropriately
					if(player.body.x + 35 < enemy.body.x){
						enemy.body.velocity.x = fleeSpeed;
					}
					else if(player.body.x - 35 > enemy.body.x){
						enemy.body.velocity.x = -1 * fleeSpeed;
					}
					else{
						enemy.body.velocity.x = 0;
					}
					if(player.body.y + 35 < enemy.body.y){
						enemy.body.velocity.y = fleeSpeed;
					}
					else if(player.body.y - 35 > enemy.body.y){
						enemy.body.velocity.y = -1 * fleeSpeed;
					}
					else{
						enemy.body.velocity.y = 0;
					}

				}
				else{
					enemy.body.velocity.x = 0;
					enemy.body.velocity.y = 0;
				}
			}
			//shape runs at the player, wanting to collide with the player
			else if (player.shapeType() == strong || player.shapeType() == 'x'){
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
			}

			//else the shape is not moving at all
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
		} else{
			deathEmitter.makeParticles('smoke');
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

	//kills a shape on impact with the opposing shape
	killShape: function(strong, weak){
		var rng = Math.floor(Math.random()*3);

		//calls the puffsound array for that sound type[picksrandom] play passes soundVol
		var shapeDist = Phaser.Math.distance(player.body.x, player.body.y, weak.sprite.body.x, weak.sprite.body.y);
		var soundVol = (500 - shapeDist)/1000;
		if (soundVol > .6){
					soundVol = .6;
		}
		poofArray[rng].play(null, 0, soundVol, false, false);

		//creates particles for the death of the shape
		this.createParticles(weak, true);

		//takes the sprite off the screen
		weak.sprite.kill();
	},
	
	killPlayer: function(playershape, enemyshape){
		//kills the player when collided with any shape
		this.createParticles(player, false);
		player.animations.stop();
		var rng = Math.floor(Math.random()*3);
		poofArray[rng].play(null, 0, 1, false, false);
		player.destroyed = true;
		player.kill();
		//restarts the level after we see the particle explosion of the player
		game.time.events.add(Phaser.Timer.SECOND * 2, function() { game.state.start('First_Level')});
	}
}