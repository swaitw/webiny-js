import extractPeLoaderDataFromHtml from "../../src/render/extractPeLoaderDataFromHtml";

describe("extractPeLoaderDataFromHtml Tests", () => {
    it("must detect pe-loader-data-cache tags in given HTML", async () => {
        const results = extractPeLoaderDataFromHtml(TEST_STRING);

        expect(results).toEqual([
            {
                key: "GfT8AoRsYT-1238102521",
                value: [
                    {
                        description:
                            "The Falcon 1 was an expendable launch system privately developed and manufactured by SpaceX during 2006-2009. On 28 September 2008, Falcon 1 became the first privately-developed liquid-fuel launch vehicle to go into orbit around the Earth.",
                        id: "5e9d0d95eda69955f709d1eb",
                        name: "Falcon 1",
                        wikipedia: "https://en.wikipedia.org/wiki/Falcon_1"
                    },
                    {
                        description:
                            "Falcon 9 is a two-stage rocket designed and manufactured by SpaceX for the reliable and safe transport of satellites and the Dragon spacecraft into orbit.",
                        id: "5e9d0d95eda69973a809d1ec",
                        name: "Falcon 9",
                        wikipedia: "https://en.wikipedia.org/wiki/Falcon_9"
                    },
                    {
                        description:
                            "With the ability to lift into orbit over 54 metric tons (119,000 lb)--a mass equivalent to a 737 jetliner loaded with passengers, crew, luggage and fuel--Falcon Heavy can lift more than twice the payload of the next closest operational vehicle, the Delta IV Heavy, at one-third the cost.",
                        id: "5e9d0d95eda69974db09d1ed",
                        name: "Falcon Heavy",
                        wikipedia: "https://en.wikipedia.org/wiki/Falcon_Heavy"
                    },
                    {
                        description:
                            "Starship and Super Heavy Rocket represent a fully reusable transportation system designed to service all Earth orbit needs as well as the Moon and Mars. This two-stage vehicle — composed of the Super Heavy rocket (booster) and Starship (ship) — will eventually replace Falcon 9, Falcon Heavy and Dragon.",
                        id: "5e9d0d96eda699382d09d1ee",
                        name: "Starship",
                        wikipedia: "https://en.wikipedia.org/wiki/SpaceX_Starship"
                    }
                ]
            }
        ]);
    });
});

const TEST_STRING = `...<li><h1>Starship</h1><div>Starship and Super Heavy Rocket represent a fully reusable transportation system designed to service all Earth orbit needs as well as the Moon and Mars. This two-stage vehicle — composed of the Super Heavy rocket (booster) and Starship (ship) — will eventually replace Falcon 9, Falcon Heavy and Dragon.</div><br><div>More info at&nbsp;<a href="https://en.wikipedia.org/wiki/SpaceX_Starship" target="_blank" rel="noreferrer">https://en.wikipedia.org/wiki/SpaceX_Starship</a></div></li></ul></pb-spacex></pb-cell></pb-grid></pb-block></pb-document></main><footer data-testid="pb-footer" class="wby-1lh86qf"><div class="wby-xv6w56"><div class="logo wby-1i3ok2b"><a href="/"></a><div class="copy">DEVR © 2024</div></div></div></footer></div></div><pe-loader-data-cache data-key="GfT8AoRsYT-1238102521" data-value="[{&quot;id&quot;:&quot;5e9d0d95eda69955f709d1eb&quot;,&quot;name&quot;:&quot;Falcon 1&quot;,&quot;description&quot;:&quot;The Falcon 1 was an expendable launch system privately developed and manufactured by SpaceX during 2006-2009. On 28 September 2008, Falcon 1 became the first privately-developed liquid-fuel launch vehicle to go into orbit around the Earth.&quot;,&quot;wikipedia&quot;:&quot;https://en.wikipedia.org/wiki/Falcon_1&quot;},{&quot;id&quot;:&quot;5e9d0d95eda69973a809d1ec&quot;,&quot;name&quot;:&quot;Falcon 9&quot;,&quot;description&quot;:&quot;Falcon 9 is a two-stage rocket designed and manufactured by SpaceX for the reliable and safe transport of satellites and the Dragon spacecraft into orbit.&quot;,&quot;wikipedia&quot;:&quot;https://en.wikipedia.org/wiki/Falcon_9&quot;},{&quot;id&quot;:&quot;5e9d0d95eda69974db09d1ed&quot;,&quot;name&quot;:&quot;Falcon Heavy&quot;,&quot;description&quot;:&quot;With the ability to lift into orbit over 54 metric tons (119,000 lb)--a mass equivalent to a 737 jetliner loaded with passengers, crew, luggage and fuel--Falcon Heavy can lift more than twice the payload of the next closest operational vehicle, the Delta IV Heavy, at one-third the cost.&quot;,&quot;wikipedia&quot;:&quot;https://en.wikipedia.org/wiki/Falcon_Heavy&quot;},{&quot;id&quot;:&quot;5e9d0d96eda699382d09d1ee&quot;,&quot;name&quot;:&quot;Starship&quot;,&quot;description&quot;:&quot;Starship and Super Heavy Rocket represent a fully reusable transportation system designed to service all Earth orbit needs as well as the Moon and Mars. This two-stage vehicle — composed of the Super Heavy rocket (booster) and Starship (ship) — will eventually replace Falcon 9, Falcon Heavy and Dragon.&quot;,&quot;wikipedia&quot;:&quot;https://en.wikipedia.org/wiki/SpaceX_Starship&quot;}]"></pe-loader-data-cache></body></html>`;
