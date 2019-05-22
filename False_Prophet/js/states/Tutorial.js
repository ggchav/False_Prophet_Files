var player;
var triangle = [];
var square= [];
var circle= [];
var barrier;
var music;

var triangleCollisionGroup;
var squareCollisionGroup;
var circleCollisionGroup;
var playerCollisionGroup;

//audio array for each sound type
var flee = new Array();
var anger = new Array();
var follow = new Array();
var poofArray = new Array();

var menuLabel;

//var channel_max = 8;	
//audiochannels = new Array();

var Tutorial = function(game){};

Tutorial.prototype = {

	create: function() {
		//set the bounds of the level
		game.world.setBounds(0, 0, 3000, 2500);

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
		player = new Player(game, 1950, 450);

		//reset player shape type
		player.reset(false);

		player.body.setCollisionGroup(playerCollisionGroup);

		//declare a death emitter so that function can later call it with new params easily
		deathEmitter = game.add.emitter(player.x, player.y, 100);

		//fix the camera with the background and make it follow the player
		background.fixedToCamera = true;

		//adds an overlay to the game
		overlay = game.add.image(0, 0, 'overlay');
		overlay.scale.x = .7;
		overlay.scale.y = .7;

		//fixes the overlay to the camera
		overlay.fixedToCamera = true;

		//makes the camera follow the player
		game.camera.follow(player);

		//creates black space in big divider
		var graphics = game.add.graphics(0, 0);
		graphics.beginFill(0x000000);
		graphics.lineStyle(10, 0x000000, 1);
		graphics.drawRect(0, 765, 1900, 990);

		//declares all barriers used for the level
		for (i = 0; i < 8; i++){
			//barriers for the big dividers top and bottom
			barrier = new Barrier(game, i * 250, 775, 90, 0x5b5b5b);
			barrier.body.setCollisionGroup(barrierCollisionGroup);
			barrier.body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);
			barrier = new Barrier(game, i * 250, 1745, 90, 0x5b5b5b);
			barrier.body.setCollisionGroup(barrierCollisionGroup);
			barrier.body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);

			if(i % 2 == 0){
				//barriers for the big dividers side
				barrier = new Barrier(game, 1890, 885 + ((i/2) * 250), 0, 0x5b5b5b);
				barrier.body.setCollisionGroup(barrierCollisionGroup);
				barrier.body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);
			}

			if(i % 3 == 0){
				//barriers for individual shape boxes
				barrier = new Barrier(game, 2490, 500 + ((i/3) * 400), 0, 0xe2e2e2);
				barrier.body.setCollisionGroup(barrierCollisionGroup);
				barrier.body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);
				barrier = new Barrier(game, 2760, 500 + ((i/3) * 400), 0, 0xe2e2e2);
				barrier.body.setCollisionGroup(barrierCollisionGroup);
				barrier.body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);
				barrier = new Barrier(game, 2625, 390 + ((i/3) * 400), 90, 0xe2e2e2);
				barrier.body.setCollisionGroup(barrierCollisionGroup);
				barrier.body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);
				barrier = new Barrier(game, 2625, 610 + ((i/3) * 400), 90, 0xe2e2e2);
				barrier.body.setCollisionGroup(barrierCollisionGroup);
				barrier.body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);

				//barriers for tops and bottoms of big box
				barrier = new Barrier(game, 2325 + ((i/3) * 250), 2090, 90, 0xe2e2e2);
				barrier.body.setCollisionGroup(barrierCollisionGroup);
				barrier.body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);
				barrier = new Barrier(game, 2325 + ((i/3) * 250), 2310, 90, 0xe2e2e2);
				barrier.body.setCollisionGroup(barrierCollisionGroup);
				barrier.body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);

			}

			if(i % 4 == 0){
				//barriers for sides of big box
				barrier = new Barrier(game, 2190 + ((i/4) * 770), 2200, 0, 0xe2e2e2);
				barrier.body.setCollisionGroup(barrierCollisionGroup);
				barrier.body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);
			}

		}

		//creates enemies from prefabs and adds them to their collision group while assigning collision attributes
		for (i = 0; i < 2; i++){
			if(i == 0){
				triangle[i] = new Enemy(game, 2600, 600, 'triangle');
				circle[i] = new Enemy(game, 2600, 1000, 'circle');
				square[i] = new Enemy(game, 2600, 1400, 'square');
			}
			else{
				triangle[i] = new Enemy(game, 2300, 2150, 'triangle');
				circle[i] = new Enemy(game, 2500, 2150, 'circle');
				square[i] = new Enemy(game, 2700, 2150, 'square');
			}

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

	menuLabel = game.add.text(game.width/2, 600, '0', {font: '30px Arial', fill: '#ffffff'});
	menuLabel.anchor.setTo(.5);
	//player.addChild(menuLabel);
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

		menuLabel.fixedToCamera = true;
    	menuLabel.cameraOffset.setTo(game.width/2, game.height - 18);
		game.world.bringToTop(menuLabel);

		if (player.cooldownLeft < 1){

			menuLabel.alpha = 0;
		} else{
			menuLabel.alpha = 1;
		}
		if (player.disguiseLeft < 1){
			menuLabel.setText("Redisguise available in " + player.cooldownLeft);
		} else{
			menuLabel.setText("Disguise disappears in " + player.disguiseLeft);
		}
		
		
		
	},
	shapeMovement: function(type, same, weak, strong){
		//repeat for the provided shape
		type.forEach( enemyloop = function(enemy){
			//how quickly a shape runs away
			var fleeSpeed = 220;
			//how quickly a shape runs toward the player aggresively
			var angerSpeed = 240;
			//how quickly a shape follows the player
			var followSpeed = 150;
			//how close a shape has to be to "see" the player shape and react
			var sightRange = 520;
			//the approximate proximity following shapes will go before they stop moving toward player
			var followDist = 120;
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
	createParticles: function(shape,enemyBool){
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

	killShape: function(strong, weak){
		//kills shapes when they collide
		//createParticles throws an error when passed anything but the player for unknown reasons
		//this.createParticles(weak);
		var rng = Math.floor(Math.random()*3);
		//calls the puffsound array for that sound type[picksrandom] play passes soundVol
		var shapeDist = Phaser.Math.distance(player.body.x, player.body.y, weak.body.x, weak.body.y);
		var soundVol = (500 - shapeDist)/1000;
		if (soundVol > .6){
					soundVol = .6;
		}
		poofArray[rng].play(null, 0, soundVol,false,false);
		this.createParticles(weak, true);
		//weak.destroy();
		weak.sprite.kill();
	},
	
	killPlayer: function(playershape, shapes){
		//kills the player when collided with any shape
		this.createParticles(player, false);
		player.animations.stop();
		var rng = Math.floor(Math.random()*3);
		poofArray[rng].play(null, 0, 1,false,false);
		player.destroyed = true;
		player.kill();
		//restarts the level after we see the particle explosion of the player
		game.time.events.add(Phaser.Timer.SECOND * 2, function() { game.state.start('Tutorial')});
	}
}