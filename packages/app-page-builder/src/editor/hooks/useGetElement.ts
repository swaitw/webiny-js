import { useRecoilCallback } from "recoil";
import { elementByIdSelector } from "~/editor/recoil/modules";

export const useGetElement = () => {
    return useRecoilCallback(({ snapshot }) => async (id: string) => {
        return await snapshot.getPromise(elementByIdSelector(id));
    });
};
