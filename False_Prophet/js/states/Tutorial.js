var Tutorial = function(game){
	var player;
	var triangle;
};

Tutorial.prototype = {

	create: function() {

		//To test out the player prefab
		player = new Player(game, 50, 50);
		triangle = new Triangles(game, 500, 300);

	},

	update: function() {

		/*
		//follows the player, keeping a distance
		if(Phaser.Math.distance(player.body.x, player.body.y, triangle.body.x, triangle.body.y) <= 300 && Phaser.Math.distance(player.body.x, player.body.y, triangle.body.x, triangle.body.y) >= 100){
			game.physics.arcade.moveToObject(triangle, player, 100, 2000);
		}
		else{
			triangle.body.velocity.x = 0;
			triangle.body.velocity.y = 0;
		}

		//flees from the player
		if(Phaser.Math.distance(player.body.x, player.body.y, triangle.body.x, triangle.body.y) <= 300){
			if(player.body.x < triangle.body.x && player.body.y < triangle.body.y){
				game.physics.arcade.moveToXY(triangle, player.body.x + 200, player.body.y + 200, 100, 700);
			}
			else if(player.body.x < triangle.body.x && player.body.y > triangle.body.y){
				game.physics.arcade.moveToXY(triangle, player.body.x + 200, player.body.y - 200, 100, 700);
			}
			else if(player.body.x > triangle.body.x && player.body.y < triangle.body.y){
				game.physics.arcade.moveToXY(triangle, player.body.x - 200, player.body.y + 200, 100, 700);
			}
			else {
				game.physics.arcade.moveToXY(triangle, player.body.x - 200, player.body.y - 200, 100, 700);
			}
		}
		else{
			triangle.body.velocity.x = 0;
			triangle.body.velocity.y = 0;
		}

		*/

	}
}