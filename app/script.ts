import startGame from "./src/Startup";

console.log("Oh hai! 🖤");

let game;
async function start(realData = false) {
    game = await startGame(realData);
}

start();

export { };