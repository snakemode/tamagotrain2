export interface TrainEvent {
    source: string;
    arrived?: boolean;
    departed?: boolean;
    departsInMs?: number;
    sourceMessage?: any;
}

export type TrainEventCallback = (trainEvent: TrainEvent) => void;
