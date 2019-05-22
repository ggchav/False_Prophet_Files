var MainMenu = function(game){};

MainMenu.prototype = {

	preload: function() {

		//load image assets
		game.load.path = 'assets/img/';

		game.load.image('x', 'x0.png');
		//game.load.image('background', 'tempbackground.png');
		game.load.image('background', 'woodbackground.jpg');
		game.load.image('barrier', 'barrier.png');
		game.load.image('triangle', 'triangle0.png');
		game.load.image('square', 'square0.png');
		game.load.image('circle', 'circle0.png');
		game.load.image('overlay', 'overlay.png');
 		game.load.image('smoke', 'smoke.png');
 		game.load.image('shapekey', 'shapekey.png');

 		game.load.physics('spritephysics', 'spritephysics.json')
		game.load.atlasJSONHash('spritesheet', 'spritesheet.png', 'sprites.json');
		
		// load audio assets
		game.load.path = 'assets/sound/';
		game.load.audio('music','music.mp3');
		game.load.audio('transform','changepoof.mp3');
		for (i = 0; i < 3; i++) {
			game.load.audio('poof'+i,['deathpoof'+i+'.mp3']);
		}
		for (i = 1; i < 7; i++){
			var soundtype = "flee";
			game.load.audio(soundtype+i,[soundtype+i+'.wav']);
			soundtype = "anger";
			game.load.audio(soundtype+i,[soundtype+i+'.wav']);
			soundtype = "follow";
			game.load.audio(soundtype+i,[soundtype+i+'.wav']);

		}
	},

	create: function() {

		//creates text for the the mainmenu with controls and a prompt to start the game
		var menuLabel = game.add.text(game.width/2, 100, 'Main Menu', {font: '50px Arial', fill: '#ffffff'});
		var controlsLabel = game.add.text(game.width/2, 300, 'Use the W, A, S, D keys to move', {font: '25px Arial', fill: '#ffffff'});
		var controlsLabel2 = game.add.text(game.width/2, 400, 'Use the J, K, L keys to shape shift', {font: '25px Arial', fill: '#ffffff'});
		var startLabel = game.add.text(game.width/2, 500, 'Press the W key to begin', {font: '25px Arial', fill: '#ffffff'});
		menuLabel.anchor.set(0.5);
		controlsLabel.anchor.set(0.5);
		controlsLabel2.anchor.set(0.5);
		startLabel.anchor.set(0.5);
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