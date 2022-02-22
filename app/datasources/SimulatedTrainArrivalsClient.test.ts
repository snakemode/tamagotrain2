import SimulatedTrainArrivalsClient from "./SimulatedTrainArrivalsClient";

describe("SimulatedTrainArrivalsClient", () => {

    let sut: SimulatedTrainArrivalsClient;
    let callbackInterval: any;
    beforeEach(() => {
        callbackInterval = 2;
        sut = new SimulatedTrainArrivalsClient(callbackInterval);
    });

    it("Defaults to 12 second interval", async () => {
        sut = new SimulatedTrainArrivalsClient();
        expect(sut.interval).toBe(12000);
    });

    it("listenForEvents Simulates a message of a train arriving", async () => {
        let returnedMessages = [];

        sut.listenForEvents("some-line-id", message => returnedMessages.push(message));

        expect(returnedMessages[0]).toStrictEqual({ arrived: true, source: "SimulatedTrainArrivalsClient" });
    });

    it("listenForEvents Simulates a message of a train leaving after a delay", async () => {
        let returnedMessages = [];

        sut.listenForEvents("some-line-id", message => returnedMessages.push(message));
        await sleep((callbackInterval) + 2);

        expect(returnedMessages[1]).toStrictEqual({ departed: true, source: "SimulatedTrainArrivalsClient" });
    });

    it("listenForEvents Simulation loops if you keep it running", async () => {
        let returnedMessages = [];
        const numberOfLoops = 5;

        sut.listenForEvents("some-line-id", message => returnedMessages.push(message));
        await sleep((callbackInterval) * numberOfLoops + 2);

        expect(returnedMessages.length).toBe(numberOfLoops);
    });

    it("stopListening Simulation can be stopped", async () => {
        let returnedMessages = [];
        const numberOfLoops = 5;
        sut.listenForEvents("some-line-id", message => returnedMessages.push(message));
        await sleep((callbackInterval) * numberOfLoops + 5);

        sut.stopListening();
        await sleep(150); // Nothing happening here.

        expect(returnedMessages.length).toBe(numberOfLoops);
    });
});


const sleep = (timeout) => new Promise(r => setTimeout(r, timeout));