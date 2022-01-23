import { ITickable } from "../traits/ITickable";
import { Position } from "../types";

export interface IGameEntity extends Position, ITickable {
    id: string;
    isDisplayed: boolean;
    completed: boolean;
}
