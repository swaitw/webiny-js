import React, { useCallback } from "react";
import { i18n } from "@webiny/app/i18n";
import mime from "mime/lite";

mime.define({ "image/x-icon": ["ico"] }, true);
mime.define({ "image/jpg": ["jpg"] }, true);
mime.define({ "image/vnd.microsoft.icon": ["ico"] }, true);

const t = i18n.ns("app-admin/file-manager/components/bottom-info-bar/supported-files");

const getUniqueFilePlugins = (accept: string[]): string[] => {
    const exts: Record<string, boolean> = {};
    accept.forEach(item => {
        const ext = mime.getExtension(item);
        if (!ext) {
            return;
        }
        exts[ext] = true;
    });

    return Object.keys(exts);
};

export interface SupportedFileTypesProps {
    accept: string[];
    loading: boolean;
    totalCount: number;
    currentCount: number;
}

const SupportedFileTypes = ({
    accept,
    loading,
    totalCount,
    currentCount
}: SupportedFileTypesProps) => {
    const getLabel = useCallback((count = 0): string => {
        return `${count} ${count === 1 ? "file" : "files"}`;
    }, []);

    if (!accept || loading) {
        return null;
    }

    if (accept.length === 0) {
        return (
            <span>
                {t`Showing {currentCountLabel} out of {totalCountLabel} from all file extensions.`({
                    currentCountLabel: String(currentCount),
                    totalCountLabel: getLabel(totalCount)
                })}
            </span>
        );
    }

    return (
        <span>
            {t`Showing {currentCountLabel} out of {totalCountLabel} from the following file extensions: {files}.`(
                {
                    currentCountLabel: String(currentCount),
                    totalCountLabel: getLabel(totalCount),
                    files: getUniqueFilePlugins(accept).join(", ")
                }
            )}
        </span>
    );
};

export default SupportedFileTypes;
