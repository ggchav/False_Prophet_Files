var MainMenu = function(game){};

MainMenu.prototype = {

	preload: function() {

		//load image assets
		game.load.path = 'assets/img/';

		game.load.image('x', 'playerx.png');
		game.load.image('background', 'tempbackground.png');
		game.load.image('barrier', 'barrier.png');
		game.load.image('triangle', 'triangle0.png');
		game.load.image('square', 'square0.png');
		game.load.image('circle', 'circle0.png');
		game.load.atlasJSONHash('spritesheet', 'spritesheet.png', 'sprites.json');
		
		// load audio assets
		game.load.path = 'assets/audio/';

	},

	create: function() {

		//creates text for the the mainmenu with controls and a prompt to start the game
		var menuLabel = game.add.text(480, 100, 'Main Menu', {font: '50px Arial', fill: '#ffffff'});
		var controlsLabel = game.add.text(430, 300, 'Use the W, A, S, D keys to move', {font: '25px Arial', fill: '#ffffff'});
		var controlsLabel = game.add.text(420, 400, 'Use the J, K, L keys to shape shift', {font: '25px Arial', fill: '#ffffff'});
		var startLabel = game.add.text(470, 500, 'Press the W key to begin', {font: '25px Arial', fill: '#ffffff'});

		//adds the W key as an input
		var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

		//if the W key is pressed, go to the start function
		wKey.onDown.addOnce(this.start, this);

	},
	
	start: function() {

		//sends the player to the tutorial state
		game.state.start('Tutorial');
	}

}