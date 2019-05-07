var player;
var triangle = [];
var square= [];
var circle= [];
var shapeGroup;

var Tutorial = function(game){};

Tutorial.prototype = {
	create: function() {
		//game.world.setBounds(0, 0, 3000, 1500);

		shapeGroup = game.add.group();
		shapeGroup.enableBody = true;

		player = new Player(game, 450, 250);

		//tilesprite.fixedToCamera = true;
		//game.camera.follow(player);

		for (i=0; i<4;i++){
			triangle[i] = new Enemy(game, i*110, 15, 'triangle');
			circle[i] = new Enemy(game, 700+ i*110, 15, 'circle');
			square[i] = new Enemy(game, 600+ i*110, 550, 'square');
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

		//For when an opposing shapes contact eachother
		game.physics.arcade.overlap(triangle, square, this.killShape, null, this);
		game.physics.arcade.overlap(square, circle, this.killShape, null, this);
		game.physics.arcade.overlap(circle, triangle, this.killShape, null, this);

		//For when a shape comes into contact with a player
		game.physics.arcade.overlap(shapeGroup, player, this.killPlayer, null, this);

		//Follows though the different shape/player interactions
		this.shapeMovement(triangle, 0, 1, 2);
		this.shapeMovement(circle, 1, 2, 0);
		this.shapeMovement(square, 2, 0, 1);

		/*
		if (!game.camera.atLimit.x){
        	tilesheet.tilePosition.x -= (player.body.velocity.x * game.time.physicsElapsed);
		}

		if (!game.camera.atLimit.y){
        	tilesheet.tilePosition.y -= (player.body.velocity.y * game.time.physicsElapsed);
		}
		*/
	},
	shapeMovement: function(type, same, weak, strong){
		type.forEach(function(enemy){
       		if (player.shapeType() == same){
				//console.log("We are the same!");
				//console.log("enemy shape type: "+ enemy.shapeType() + "  playertype: "+ player.shapeType())
				if(Phaser.Math.distance(player.body.x, player.body.y, enemy.body.x, enemy.body.y) <= 250 && Phaser.Math.distance(player.body.x, player.body.y, enemy.body.x, enemy.body.y) >= 120){
					game.physics.arcade.moveToObject(enemy, player, 100, 2000);
				}
				else{
					enemy.body.velocity.x = 0;
					enemy.body.velocity.y = 0;
				}
			}
			else if (player.shapeType() == weak){
				//console.log("Run Away!");
				if(Phaser.Math.distance(player.body.x, player.body.y, enemy.body.x, enemy.body.y) <= 250){
					if(player.body.x < enemy.body.x && player.body.y < enemy.body.y){
						game.physics.arcade.moveToXY(enemy, player.body.x + 200, player.body.y + 200, 100, 800);
					}
					else if(player.body.x < enemy.body.x && player.body.y > enemy.body.y){
						game.physics.arcade.moveToXY(enemy, player.body.x + 200, player.body.y - 200, 100, 800);
					}
					else if(player.body.x > enemy.body.x && player.body.y < enemy.body.y){
						game.physics.arcade.moveToXY(enemy, player.body.x - 200, player.body.y + 200, 100, 800);
					}
					else {
						game.physics.arcade.moveToXY(enemy, player.body.x - 200, player.body.y - 200, 100, 800);
					}
				}
				else{
					enemy.body.velocity.x = 0;
					enemy.body.velocity.y = 0;
				}
			}
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
			else{
				enemy.body.velocity.x = 0;
				enemy.body.velocity.y = 0;
			}
       	});
	},
	killShape: function(strong, weak){
		weak.kill();
	},
	killPlayer: function(shapes, player){
		player.kill();

		game.state.start('Tutorial');
	}
}