const Game = require("./Game");
const GameUi = require("./GameUi");

const AblyTrainArrivalsClient = require("./AblyTrainArrivalsClient");
const SimulatedTrainArrivalsClient = require("./SimulatedTrainArrivalsClient");

let game, ui, dataSource;

async function startGame(useRealData = false) {
  if (game) {
    game.stop(false);
  }  
  
  dataSource = useRealData 
                ? new AblyTrainArrivalsClient() 
                : new SimulatedTrainArrivalsClient();
  
  game = new Game();
  ui = new GameUi(game);
  
  game.start({
    onGameStart: async () => await dataSource.listenForEvents("940GZZLUKSX", msg => game.registerEvent(game, msg)),
    onGameEnd: () => dataSource.stopListening()
  });

  ui.startRendering(game, dataSource);
  
  return game;
}

module.exports = { startGame };