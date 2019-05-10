var player;
var triangle = [];
var square= [];
var circle= [];
//audio array for each sound type
var flee = new Array();
var attack = new Array();
var follow = new Array();

//var channel_max = 8;	
//audiochannels = new Array();

var shapeGroup;

var Tutorial = function(game){};

Tutorial.prototype = {

	create: function() {
		//set the bounds of the level
		game.world.setBounds(0, 0, 3600, 1800);
		//load sounds into an array

		for (i = 1; i < 6; i++){
			 flee[i-1] = game.add.audio("flee"+i);
		}
		for (i = 1; i < 6; i++){
			 attack[i-1] = game.add.audio("attack"+i);
		}
		for (i = 1; i < 6; i++){
			 follow[i-1] = game.add.audio("follow"+i);
		}
		//initialize the tilesprite for the background
		background = game.add.tileSprite(0, 0, 1200, 600, 'background');

		//create the group used for the enemy shapes
		shapeGroup = game.add.group();
		shapeGroup.enableBody = true;

		//create the player from the prefab
		player = new Player(game, 300, 865);

		//fix the camera with the background and make it follow the player
		background.fixedToCamera = true;
		game.camera.follow(player);

		//creates enemies from prefabs and adds them to the shape group
		for (i = 0; i < 4; i++){
			triangle[i] = new Enemy(game, 1000 + i*110, 500, 'triangle');
			circle[i] = new Enemy(game, 1500 + i*110, 900, 'circle');
			square[i] = new Enemy(game, 1000 + i*110, 1300, 'square');
			shapeGroup.add(triangle[i]);
			shapeGroup.add(circle[i]);
			shapeGroup.add(square[i]);
		}

	},

	update: function() {
	// checks if player is destroyed before running these
		if (!player.destroyed){
			//for when a shape comes into contact with a player
			game.physics.arcade.overlap(shapeGroup, player, this.killPlayer, null, this);

			//follows though the different shape/player interactions
			this.shapeMovement(triangle,'triangle', 'circle', 'square');
			this.shapeMovement(circle,'circle', 'square', 'triangle');
			this.shapeMovement(square,'square', 'triangle', 'circle');
		}
		//For seperating similar shapes
		game.physics.arcade.collide(triangle, triangle);
		game.physics.arcade.collide(circle, circle);
		game.physics.arcade.collide(square, square);

		//for when an opposing shapes contact eachother
		game.physics.arcade.overlap(triangle, square, this.killShape, null, this);
		game.physics.arcade.overlap(square, circle, this.killShape, null, this);
		game.physics.arcade.overlap(circle, triangle, this.killShape, null, this);

		//instructions for the camera to stay on the screen
		if (!game.camera.atLimit.x){
        	background.tilePosition.x -= (player.body.velocity.x * game.time.physicsElapsed);
		}
		if (!game.camera.atLimit.y){
        	background.tilePosition.y -= (player.body.velocity.y * game.time.physicsElapsed);
		}
		
	},

	shapeMovement: function(type, same, weak, strong){
		//repeat for the provided shape
		type.forEach(function(enemy){
			//how quickly a shape runs away
			var fleeSpeed = 100;
			//how quickly a shape runs toward the player aggresively
			var attackSpeed = 200;
			//how close a shape has to be to "see" the player shape and react
			var sightRange = 400;
			//the approximate proximity following shapes will go before they stop moving toward player
			var followDist = 120;
			//shorthand to make it easier to refer to the distance between shape vs player
			var playerShapeDist = Phaser.Math.distance(player.body.x, player.body.y, enemy.body.x, enemy.body.y);
			//withinSightRange bool returns true if a shape can see a player
			var shapeCanSeePlayer = playerShapeDist <= sightRange;
			//shapesightRange will be the max distance shapes will attack other shapes
			//not implemented yet
			//var	shapeSightRange = 150;
			//shape follows the player if the are the same shape, never getting too close
       		if (player.shapeType() == same){
				if(shapeCanSeePlayer && playerShapeDist >= 120){
					game.physics.arcade.moveToObject(enemy, player, 100, 2000);
				}
				else{
					enemy.body.velocity.x = 0;
					enemy.body.velocity.y = 0;
				}
			}
			//shape runs away from the player
			else if (player.shapeType() == weak){
				if(shapeCanSeePlayer){

					//how many sounds that can play at once of this type
					var maxSounds = 2;
					var maxPlaying = false;
					var counter = 0;
					var rng = Math.floor(Math.random()*5);
					for (i=0; i<5; i++){
						if (flee[i].isPlaying == true){
							counter ++;
						}
					}
					if (counter >= maxSounds){
							maxPlaying = true;
					}
					if (!maxPlaying){
						flee[rng].play(null, 0,.6,false,false);
					}
					//flee[rng].play('flee',0,2,false,false);
					//changes fleespeed if closer to the player
					if(playerShapeDist <= 150){
						fleeSpeed = fleeSpeed * 1.8;
					}
					//moves the enemy appropriately
					if(player.body.x + 35 < enemy.body.x){
						enemy.body.velocity.x = fleeSpeed;
					}
					else if(player.body.x -35 > enemy.body.x){
						enemy.body.velocity.x = -1 * fleeSpeed;
					}
					else{
						enemy.body.velocity.x = 0;
					}
					if(player.body.y + 35 < enemy.body.y){
						enemy.body.velocity.y = fleeSpeed;
					}
					else if(player.body.y -35 > enemy.body.y){
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
			else if (player.shapeType() == strong){
				if(shapeCanSeePlayer){
					game.physics.arcade.moveToObject(enemy, player, attackSpeed);
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
	killShape: function(strong, weak){
		//kills shapes when they collide
		//createParticles throws an error when passed anything but the player for unknown reasons
		//this.createParticles(weak);
		weak.kill();
	},
	/*
	playSound: function(type){
		var createdChannel = false;
		//for loop that goes through each of the audio channels established in the array earlier.
		//if a channel is finished, it loads a new sound and plays it back in that channel
		for (a=0; a<audiochannels.length; a++) {
				thistime = new Date();
				var channel = audiochannels[a]['channel'];
				var soundSrc = document.getElementById(sound).src;
				if (audiochannels[a]['finished'] < thistime.getTime() && !createdChannel) {			// is this channel finished?
					audiochannels[a]['finished'] = thistime.getTime() + document.getElementById(sound).duration*2000;
					channel = document.getElementById(sound);
					channel.load();
					channel.playbackRate = playSpeed;
					channel.loop = false;
					channel.play();
					//createdChannel boolean tells the loop to stop adding more sounds in continued iterations of the for loop
					createdChannel = true;
				}
				//checks if the same sound is currently playing in another channel, if so it stops it
				if (soundSrc == channel.src && channel.currentTime > 0){
					console.log("stop attempting to run");
					channel.pause();
					channel.currentTime = 0;
				}				
		}

	}*/
	createParticles: function(shape){
		//kills shapes when they collide
		var deathEmitter = game.add.emitter(shape.x, shape.y, 100);
		deathEmitter.makeParticles(shape.shapeType());
		//set particle properties including alpha, particle size and speed
		deathEmitter.setAlpha(0.3, 1);				
		deathEmitter.minParticleScale = 0.04;		
		deathEmitter.maxParticleScale = .13;
		deathEmitter.setXSpeed(-300,300);			
		deathEmitter.setYSpeed(-300,300);			
		//start emitting 200 particles that disappear after 2000ms
		deathEmitter.start(true, 2000, null, 200);
		//loop through each particle and change it's tint to the color of the player's tint at time of death.
		deathEmitter.forEach(function(item){item.tint = shape.tint;});
	},
	killPlayer: function(shapes, playershape){
		//kills the player when collided with any shape
		this.createParticles(player);
		player.animations.stop();
		player.destroyed = true;
		player.kill();
		//restarts the level after we see the particle explosion of the player
		game.time.events.add(Phaser.Timer.SECOND * 2, function() { game.state.start('Tutorial')});
	}
}