import Game from "./src/Game";
import GameUi from "./src/GameUi";
import AblyTrainArrivalsClient from "./src/datasources/AblyTrainArrivalsClient";
import SimulatedTrainArrivalsClient from "./src/datasources/SimulatedTrainArrivalsClient";
import IDataSource from "./src/datasources/IDataSource";

console.log("Oh hai! 🖤");

let game: Game;
let ui: GameUi;
let dataSource: IDataSource;

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