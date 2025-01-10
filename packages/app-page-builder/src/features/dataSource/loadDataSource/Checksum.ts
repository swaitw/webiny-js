import { createHashing } from "@webiny/app/utils";

const sha1 = createHashing("SHA-1");

export class Checksum {
    private readonly checksum: string;

    private constructor(checksum: string) {
        this.checksum = checksum;
    }

    static async createFrom(value: unknown) {
        return new Checksum(await sha1(value));
    }

    getChecksum() {
        return this.checksum;
    }
}
