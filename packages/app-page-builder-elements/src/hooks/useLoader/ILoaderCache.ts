export interface ILoaderCache {
    read: <TData = unknown>(key: string) => TData | null;
    write: <TData = unknown>(key: string, value: TData) => void;
    remove: (key: string) => void;
    clear: () => void;
}
