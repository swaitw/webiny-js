import { ElementStylesModifier } from "~/types";

const border: ElementStylesModifier = ({ element, theme }) => {
    const { border } = element.data.settings || {};
    if (!border) {
        return {};
    }

    return Object.keys(theme.breakpoints || {}).reduce((returnStyles, breakpointName) => {
        if (!border[breakpointName]) {
            return returnStyles;
        }

        const values = border[breakpointName];

        let borderColor = values.color;
        if (theme.styles.colors?.[borderColor]) {
            borderColor = theme.styles.colors?.[borderColor];
        }

        const styles = {
            borderStyle: values.style,
            borderColor
        };

        const { width } = values;
        if (width) {
            if (width.advanced) {
                const top = width.top || 0;
                const right = width.right || 0;
                const bottom = width.bottom || 0;
                const left = width.left || 0;

                Object.assign(styles, {
                    borderWidth: `${top}px ${right}px ${bottom}px ${left}px `
                });
            } else {
                Object.assign(styles, {
                    borderWidth: parseInt(width.all || "0")
                });
            }
        }

        const { radius } = values;
        if (radius) {
            if (radius.advanced) {
                Object.assign(styles, {
                    borderTopLeftRadius: radius.topLeft && parseInt(radius.topLeft),
                    borderTopRightRadius: radius.topRight && parseInt(radius.topRight),
                    borderBottomLeftRadius: radius.bottomLeft && parseInt(radius.bottomLeft),
                    borderBottomRightRadius: radius.bottomRight && parseInt(radius.bottomRight)
                });
            } else {
                Object.assign(styles, { borderRadius: parseInt(radius.all || "0") });
            }
        }

        return { ...returnStyles, [breakpointName]: styles };
    }, {});
};

export const createBorder = () => border;
