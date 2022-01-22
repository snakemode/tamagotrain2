import Game from "./src/Game";
import startGame from "./src/Startup";

console.log("Oh hai! 🖤");

let game: Game;

async function start(realData = false) {
    game = await startGame(realData);
}

start();

export { };