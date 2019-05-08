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
		//For seperating similar shapes
		game.physics.arcade.collide(triangle, triangle);
		game.physics.arcade.collide(circle, circle);
		game.physics.arcade.collide(square, square);

		//for when an opposing shapes contact eachother
		game.physics.arcade.overlap(triangle, square, this.killShape, null, this);
		game.physics.arcade.overlap(square, circle, this.killShape, null, this);
		game.physics.arcade.overlap(circle, triangle, this.killShape, null, this);

		//for when a shape comes into contact with a player
		game.physics.arcade.overlap(shapeGroup, player, this.killPlayer, null, this);

		//follows though the different shape/player interactions
		this.shapeMovement(triangle, 0, 1, 2);
		this.shapeMovement(circle, 1, 2, 0);
		this.shapeMovement(square, 2, 0, 1);

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
				if(Phaser.Math.distance(player.body.x, player.body.y, enemy.body.x, enemy.body.y) <= 250 && Phaser.Math.distance(player.body.x, player.body.y, enemy.body.x, enemy.body.y) >= 120){
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
				if(Phaser.Math.distance(player.body.x, player.body.y, enemy.body.x, enemy.body.y) <= 250 && Phaser.Math.distance(player.body.x, player.body.y, enemy.body.x, enemy.body.y) >= 70){
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
		weak.kill();
	},

	killPlayer: function(shapes, player){
		//kills the player when collided with any shape
		player.kill();

		//restarts the level
		game.state.start('Tutorial');
	}
}