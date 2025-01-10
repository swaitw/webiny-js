import React from "react";

export interface CompositionScopeContext {
    scope: string[];
}

const CompositionScopeContext = React.createContext<CompositionScopeContext | undefined>(undefined);

interface CompositionScopeProps {
    name: string;
    children: React.ReactNode;
}

export const CompositionScope = ({ name, children }: CompositionScopeProps) => {
    const parentScope = useCompositionScope();

    return (
        <CompositionScopeContext.Provider value={{ scope: [...parentScope, name] }}>
            {children}
        </CompositionScopeContext.Provider>
    );
};

export function useCompositionScope() {
    const context = React.useContext(CompositionScopeContext);
    if (!context) {
        return [];
    }
    return context.scope;
}
