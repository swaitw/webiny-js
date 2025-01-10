import styled from "@emotion/styled";

export const BottomInfoBarWrapper = styled("div")`
    font-size: 0.8rem;
    position: sticky;
    bottom: 0;
    height: 30px;
    color: var(--mdc-theme-text-secondary-on-background);
    border-top: 1px solid var(--mdc-theme-on-background);
    background: var(--mdc-theme-surface);
    width: 100%;
    transform: translateZ(0);
    overflow: hidden;
    display: flex;
    align-items: center;
    z-index: 1;
`;

export const BottomInfoBarInner = styled("div")`
    padding: 0 10px;
    width: 100%;
`;
