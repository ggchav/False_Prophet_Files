var MainMenu = function(game){};

MainMenu.prototype = {

	preload: function() {

		//load image assets
		game.load.path = 'assets/img/';

		game.load.image('x', 'x0.png');
		game.load.image('background', 'tempbackground.png');
		game.load.image('barrier', 'barrier.png');
		game.load.image('triangle', 'triangle0.png');
		game.load.image('square', 'square0.png');
		game.load.image('circle', 'circle0.png');
		game.load.image('overlay', 'overlay.png');
 		game.load.image('smoke', 'smoke.png');

 		game.load.physics('spritephysics', 'spritephysics.json')
		game.load.atlasJSONHash('spritesheet', 'spritesheet.png', 'sprites.json');
		
		// load audio assets
		game.load.path = 'assets/sound/';
		var soundtype = "flee";
		for (i = 1; i < 7; i++){
			game.load.audio(soundtype + i, [soundtype + i + '.wav']);
		}
		soundtype = "anger";
		for (i = 1; i < 7; i++){
			game.load.audio(soundtype + i, [soundtype + i + '.wav']);
		}
		soundtype = "follow";
		for (i = 1; i < 7; i++){
			game.load.audio(soundtype + i, [soundtype + i + '.wav']);
		}

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