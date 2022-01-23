export default interface IDataSource {
    listenForEvents(lineId: string, callback: (message: any) => void): Promise<void>;
    stopListening(): void;
}