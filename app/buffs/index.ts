import { ITickable } from "../traits/ITickable";
import CleanBuff from "./CleanBuff";
import MusicBuff from "./MusicBuff";
import VentBuff from "./VentBuff";

const buffs = {
    CleanBuff,
    MusicBuff,
    VentBuff
};

export function createBuff(name: string): ITickable {
    try {
        return new buffs[name]();
    } catch (ex) {
        throw "Could not find handler called " + name;
    }
}

export default buffs;