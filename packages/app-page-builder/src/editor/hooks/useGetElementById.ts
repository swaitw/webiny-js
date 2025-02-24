import { useRecoilCallback } from "recoil";
import { elementByIdSelector } from "~/editor/recoil/modules";

export const useGetElementById = () => {
    const getElementById = useRecoilCallback(({ snapshot }) => (value: string) => {
        return snapshot.getPromise(elementByIdSelector(value));
    });
    return { getElementById };
};
