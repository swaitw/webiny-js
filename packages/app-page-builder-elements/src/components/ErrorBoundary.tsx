import React, { ErrorInfo } from "react";
import { Element as ElementType } from "~/types";

type State =
    | {
          hasError: true;
          error: Error;
      }
    | { hasError: false; error: undefined };

interface Props {
    element: ElementType;
    [key: string]: any;
}

const displayNone = {
    display: "none"
};

declare global {
    // eslint-disable-next-line
    namespace JSX {
        interface IntrinsicElements {
            "pb-element-error": any;
        }
    }
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: undefined
        };
    }

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        return {
            hasError: true,
            error
        };
    }

    public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        const { element } = this.props;
        console.groupCollapsed(
            `%cELEMENT ERROR%c: An error occurred while rendering page element "${element.id}" of type "${element.type}".`,
            "color:red",
            "color:default"
        );
        console.log("element", element);
        console.error(error, errorInfo);
        console.groupEnd();
    }

    public override render() {
        if (this.state.hasError) {
            const elementData = {
                id: this.props.element.id,
                type: this.props.element.type,
                error: this.state.error.message
            };

            return (
                <pb-element-error style={displayNone}>
                    {JSON.stringify(elementData)}
                </pb-element-error>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
