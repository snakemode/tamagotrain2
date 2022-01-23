import Game from "../Game";

export interface ITickable {
    ticks: number;
    tick(currentGameState: Game): void;

    completed?: boolean;
    onCompletion?(currentGameState: Game): void;
}