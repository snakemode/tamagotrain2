import Game from "./Game";
import GameUi from "./ui/GameUi";
import AblyTrainArrivalsClient from "./datasources/AblyTrainArrivalsClient";
import SimulatedTrainArrivalsClient from "./datasources/SimulatedTrainArrivalsClient";
import IDataSource from "./datasources/IDataSource";

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
    ui = new GameUi();

    game.start({
        onGameStart: async () => {
            ui.bindControls(game);
            ui.startRendering(game, dataSource);
            dataSource.listenForEvents("940GZZLUKSX", msg => game.registerEvent(msg));
        },
        onGameEnd: () => {
            dataSource.stopListening();
        }
    });
}

const startButton = document.getElementById("start-with-live-data");
startButton.onclick = () => start(true);

start();

export { };