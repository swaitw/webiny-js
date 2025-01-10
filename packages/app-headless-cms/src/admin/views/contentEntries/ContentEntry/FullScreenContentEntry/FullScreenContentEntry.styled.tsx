import styled from "@emotion/styled";
import { css } from "emotion";

export const FullScreenContentEntryContainer = styled.div`
    background: var(--mdc-theme-background);
    z-index: 4;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;

    #headerToolbarGrid {
        border: 0;
        padding: 0;
        margin: 0;
    }

    #cms-content-details-tabs .webiny-ui-tabs__tab-bar {
        display: none;
    }
`;

/**
 * HEADER
 */
export const FullScreenContentEntryHeader = styled.div`
    background: var(--mdc-theme-surface);
    position: fixed;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    width: 100%;
    z-index: 4;
`;

export const FullScreenContentEntryHeaderContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
`;

export const TitleWrapper = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
    flex-direction: column;
    color: var(--mdc-theme-text-primary-on-background);
    position: relative;
    width: 100%;
    margin-left: 10px;
`;

export const EntryTitle = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

interface EntryNameProps {
    isNewEntry?: boolean;
}

export const EntryName = styled.div<EntryNameProps>`
    font-family: var(--mdc-typography-font-family);
    font-size: 20px;
    line-height: 1.4em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: ${props => (props.isNewEntry ? 0.3 : 1)};
`;

export const EntryVersion = styled.span`
    font-size: 20px;
    color: var(--mdc-theme-text-secondary-on-background);
    margin-left: 5px;
    line-height: 120%;

    @media (max-width: 800px) {
        display: none;
    }
`;

export const EntryMeta = styled.div`
    height: 20px;
    margin: -2px 2px 2px 2px;

    @media (max-width: 960px) {
        display: none;
    }
`;

/**
 * FORM
 */
export const FullScreenContentEntryContent = styled.div`
    overflow-y: scroll;
    height: calc(100vh - 64px);
    margin-top: 64px;
`;

export const FullScreenContentEntryContentFormWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

export const FullScreenContentEntryContentFormInner = styled.div`
    flex-shrink: 1;
    flex-basis: 1020px;
`;

export const FullScreenContentEntryContentFormInnerCss = css`
    height: 100% !important;
`;
