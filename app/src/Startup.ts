import Game from "./Game";
import GameUi from "./GameUi";

import AblyTrainArrivalsClient from "./AblyTrainArrivalsClient";
import SimulatedTrainArrivalsClient from "./SimulatedTrainArrivalsClient";

let game: Game;
let ui: GameUi;
let dataSource: AblyTrainArrivalsClient | SimulatedTrainArrivalsClient;

export default async function startGame(useRealData = false) {
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
