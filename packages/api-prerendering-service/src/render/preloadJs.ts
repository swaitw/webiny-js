import { RenderResult } from "~/render/types";

export const preloadJs = (render: RenderResult): void => {
    const regex = /<script (src="\/static\/js\/)/gm;
    const subst = `<script data-link-preload data-link-preload-type="markup" src="/static/js/`;
    render.content = render.content.replace(regex, subst);
};
