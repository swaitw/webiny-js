import React, { useCallback, useEffect, useMemo } from "react";
import { makeAutoObservable } from "mobx";
import { ContentEntryEditorConfig } from "@webiny/app-headless-cms";
import { CmsContentEntry } from "@webiny/app-headless-cms/types";
import { useLoadDataSource } from "@webiny/app-page-builder/features";
import {
    DataRequest,
    DataSourceData,
    IResolveDataSourceRepository
} from "@webiny/app-page-builder/features/dataSource/loadDataSource/IResolveDataSourceRepository";

type OnChange = NonNullable<React.ComponentProps<typeof ContentEntryForm>["onChange"]>;

const {
    ContentEntry: { ContentEntryForm }
} = ContentEntryEditorConfig;

class WithLocalData implements IResolveDataSourceRepository {
    private decoratee: IResolveDataSourceRepository;
    private entryContainer: EntryContainer;

    constructor(entryContainer: EntryContainer, decoratee: IResolveDataSourceRepository) {
        this.entryContainer = entryContainer;
        this.decoratee = decoratee;
        makeAutoObservable(this);
    }

    getData(key: string): DataSourceData | undefined {
        if (key.startsWith("main:")) {
            return this.entryContainer.getEntry();
        }

        return this.decoratee.getData(key);
    }

    async resolveData(request: DataRequest): Promise<void> {
        if (request.getName() === "main") {
            return;
        }

        return this.decoratee.resolveData(request);
    }
}

class EntryContainer {
    private entry: Partial<CmsContentEntry>;

    constructor(entry: Partial<CmsContentEntry>) {
        this.entry = entry;
        makeAutoObservable(this);
    }

    setEntry(entry: Partial<CmsContentEntry>) {
        this.entry = entry;
    }

    getEntry() {
        return this.entry;
    }
}

export const PassEntryToDataSource = ContentEntryForm.createDecorator(Original => {
    return function PassEntryToDataSource(props) {
        const entryContainer = useMemo(() => new EntryContainer(props.entry), []);

        const onEntryChange = useCallback<OnChange>(entry => {
            entryContainer.setEntry(entry);
        }, []);

        useEffect(() => {
            return useLoadDataSource.decorateRepository(repository => {
                return new WithLocalData(entryContainer, repository);
            });
        }, []);

        return <Original {...props} onChange={onEntryChange} />;
    };
});
