import Game from "./src/Game";
import GameUi from "./src/GameUi";
import AblyTrainArrivalsClient from "./src/AblyTrainArrivalsClient";
import SimulatedTrainArrivalsClient from "./src/SimulatedTrainArrivalsClient";

console.log("Oh hai! 🖤");

let game: Game;
let ui: GameUi;
let dataSource: AblyTrainArrivalsClient | SimulatedTrainArrivalsClient;

async function start(useRealData = false) {
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

    ui.bindControls(game);
    ui.startRendering(game, dataSource);
}

const startButton = document.getElementById("start-with-live-data");
startButton.onclick = () => start(true);

start();

export { };