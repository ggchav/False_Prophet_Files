var player;
var triangle = [];
var square= [];
var circle= [];
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
var shapeCount = 10;
//var channel_max = 8;	
//audiochannels = new Array();
var shapeGroup;

var Tutorial = function(game){};

Tutorial.prototype = {

	create: function() {
		//set the bounds of the level
		game.world.setBounds(0, 0, 4000, 3000);

		//load sounds into an array
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
		
		//initialize the tilesprite for the background
		background = game.add.tileSprite(0, 0, 1000, 1000, 'background');
		
		// add music if it's not already playing/loaded
		if (!music){
			music = game.add.audio('music');
		}
		// add music if it's not already playing
		if (!music.isPlaying){
			music.play(null, 0,.65,true);
		}
		//create the player from the prefab
		player = new Player(game, 600, 865);

		//reset player shape type
		player.reset();
		player.body.setCollisionGroup(playerCollisionGroup);
		//collideworld bounds doesn't work anymore with p2
		//player.body.collideWorldBounds = true; 
		//declare a death emitter so that function can later call it with new params easily
		deathEmitter = game.add.emitter(player.x, player.y, 100);
		//fix the camera with the background and make it follow the player
		background.fixedToCamera = true;

		overlay = game.add.image(0, 0, 'overlay');

		overlay.fixedToCamera = true;
		game.camera.follow(player);

		//creates enemies from prefabs and adds them to the shape group
		for (i = 0; i < shapeCount; i++){
			triangle[i] = new Enemy(game, 1000 + i * 110, 500, 'triangle');
			circle[i] = new Enemy(game, 1500 + i * 110, 900, 'circle');
			square[i] = new Enemy(game, 1000 + i * 110, 1300, 'square');

			triangle[i].body.setCollisionGroup(triangleCollisionGroup);
			circle[i].body.setCollisionGroup(circleCollisionGroup);
			square[i].body.setCollisionGroup(squareCollisionGroup);

			triangle[i].body.collides(squareCollisionGroup, this.killShape, this);
			circle[i].body.collides(triangleCollisionGroup, this.killShape, this);
			square[i].body.collides(circleCollisionGroup, this.killShape, this);

			triangle[i].body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);
			circle[i].body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);
			square[i].body.collides([triangleCollisionGroup, circleCollisionGroup, squareCollisionGroup, playerCollisionGroup]);
	
		}
 // Working player collision but annoying for testing purposes so I recommend turning off to prevent dying
	player.body.collides([triangleCollisionGroup,squareCollisionGroup,circleCollisionGroup], this.killPlayer, this);
	// player.body.collides(squareCollisionGroup, this.killPlayer, this);
	// player.body.collides(triangleCollisionGroup, this.killPlayer, this);
	// player.body.collides(circleCollisionGroup, this.killPlayer, this);

	game.physics.p2.updateBoundsCollisionGroup();
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
		/*
		if (player.cooldown > 0){
			this.timer = this.game.time.events.loop(Phaser.Timer.SECOND, this.updateTimer, this);

		}
		*/

		//For seperating similar shapes
		//particle effect fades in opacity towards 0 as it's lifespan approaches 0.
		deathEmitter.forEachAlive(function(p){p.alpha = p.lifespan / deathEmitter.lifespan; });
			
		
		//not a great solution, but if player is always set to the collide, changing the body type and shape won't phase it
		player.body.setCollisionGroup(playerCollisionGroup);
		game.world.bringToTop(overlay);
	},

	shapeMovement: function(type, same, weak, strong){
		//repeat for the provided shape
		type.forEach(function(enemy){
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
			//shapesightRange will be the max distance shapes will anger other shapes
			//not implemented yet
			//var	shapeSightRange = 150;
			//shape follows the player if the are the same shape, never getting too close
       		if (player.shapeType() == same){
       			if (shapeCanSeePlayer){
       				shapeSound(follow);
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
	
	if (!enemyBool){
		deathEmitter.makeParticles(shape.shapeType());
	} else{
		deathEmitter.makeParticles('smoke');
	}
	//set particle properties including alpha, particle size and speed
	
	deathEmitter.setAlpha(0.3, 1);				
	deathEmitter.minParticleScale = 0.04;		
	deathEmitter.maxParticleScale = .13;
	deathEmitter.setXSpeed(-200, 200);			
	deathEmitter.setYSpeed(-200, 200);			
	//start emitting 150 particles that disappear after 1500ms
	deathEmitter.start(true, 1500, null, 150);
	//loop through each particle and change it's tint to the color of the player's tint at time of death.
	if (!enemyBool)
		deathEmitter.forEach(function(item){item.tint = shape.tint;});
	},

	killShape: function(strong, weak){
		//kills shapes when they collide
		//createParticles throws an error when passed anything but the player for unknown reasons
		//this.createParticles(weak);
		var rng = Math.floor(Math.random()*3);
		//calls the puffsound array for that sound type[picksrandom] play passes soundVol
		poofArray[rng].play(null, 0, 1,false,false);
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