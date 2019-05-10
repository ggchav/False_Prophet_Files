var player;
var triangle = [];
var square= [];
var circle= [];
var shapeGroup;

var Tutorial = function(game){};

Tutorial.prototype = {

	create: function() {
		//set the bounds of the level
		game.world.setBounds(0, 0, 3600, 1800);

		//initialize the tilesprite for the background
		background = game.add.tileSprite(0, 0, 1200, 600, 'background');

		//create the group used for the enemy shapes
		shapeGroup = game.add.group();
		shapeGroup.enableBody = true;

		triangleGroup = game.add.group(shapeGroup);
		squareGroup = game.add.group(shapeGroup);
		circleGroup = game.add.group(shapeGroup);

		//create the player from the prefab
		player = new Player(game, 300, 865);

		player.destroyed = false;

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
		//game.physics.arcade.overlap(Enemy, Enemy, this.killShape, null, this);

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

			//shape follows the player if the are the same shape, never getting too close
       		if (player.shapeType() == same){
				if(Phaser.Math.distance(player.body.x, player.body.y, enemy.body.x, enemy.body.y) <= 350 && Phaser.Math.distance(player.body.x, player.body.y, enemy.body.x, enemy.body.y) >= 120){
					game.physics.arcade.moveToObject(enemy, player, 100, 2000);
				}
				else{
					enemy.body.velocity.x = 0;
					enemy.body.velocity.y = 0;
				}
			}

			//shape runs away from the player
			else if (player.shapeType() == weak){
				if(Phaser.Math.distance(player.body.x, player.body.y, enemy.body.x, enemy.body.y) <= 300){
					if(player.body.x < enemy.body.x && player.body.y < enemy.body.y){
						game.physics.arcade.moveToXY(enemy, player.body.x + 200, player.body.y + 200, 100, 700);
					}
					else if(player.body.x < enemy.body.x && player.body.y > enemy.body.y){
						game.physics.arcade.moveToXY(enemy, player.body.x + 200, player.body.y - 200, 100, 700);
					}
					else if(player.body.x > enemy.body.x && player.body.y < enemy.body.y){
						game.physics.arcade.moveToXY(enemy, player.body.x - 200, player.body.y + 200, 100, 700);
					}
					else {
						game.physics.arcade.moveToXY(enemy, player.body.x - 200, player.body.y - 200, 100, 700);
					}
				}
				else{
					enemy.body.velocity.x = 0;
					enemy.body.velocity.y = 0;
				}
			}

			//shape runs at the player, wanting to collide with the player
			else if (player.shapeType() == strong){
				//console.log("Attack!");
				if(Phaser.Math.distance(player.body.x, player.body.y, enemy.body.x, enemy.body.y) <= 350 && Phaser.Math.distance(player.body.x, player.body.y, enemy.body.x, enemy.body.y) >= 70){
					game.physics.arcade.moveToObject(enemy, player, 150);
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
		console.log("weaktype:" + weak.shapeType());
		this.createParticles(weak);
		weak.kill();
	},
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
		//restarts the level
		game.time.events.add(Phaser.Timer.SECOND * 2, function() { game.state.start('Tutorial')});
	}

}