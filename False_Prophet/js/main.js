var game = new Phaser.Game(1280, 720, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//initialize all states
game.state.add('MainMenu', MainMenu);
game.state.add('Tutorial', Tutorial);
game.state.add('First_Level', First_Level);
game.state.add('Second_Level', Second_Level);
game.state.add('EndGame', EndGame);

//starts the game on the mainmenu state
game.state.start('MainMenu');

function preload() {

}

function create() {

}

function update() {

}