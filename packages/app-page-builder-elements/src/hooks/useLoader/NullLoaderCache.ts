import { ILoaderCache } from "./ILoaderCache";

export class NullLoaderCache implements ILoaderCache {
    read() {
        return null;
    }

    write() {
        return;
    }

    remove() {
        return;
    }

    clear() {
        return;
    }
}
