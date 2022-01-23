export default interface IDataSource {
    listenForEvents(id: string, callback: (message: any) => void): Promise<void>;
    stopListening(): void;
}