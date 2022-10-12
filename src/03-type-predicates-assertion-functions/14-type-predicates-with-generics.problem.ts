import { isBodyElement, isDivElement } from "fake-external-lib";
import { it } from "vitest";
import { Equal, Expect } from "../helpers/type-utils";
// Functions that are declared as type predicate, must return a boolean. When the return value is true, TypeScript assumes that the return type is the one that's declared in the type predicate. If this function returns true, TypeScript assumes that the provided argument page is of type Article.
interface DOMNodeExtractorConfig<T, Result> {
  isNode: (node: unknown) => node is T;
  transform: (node: T) => Result;
}

const createDOMNodeExtractor = <T, TResult>(config: DOMNodeExtractorConfig<T, TResult>) => {
  return (nodes: unknown[]): TResult[] => {
    return nodes.filter(config.isNode).map(config.transform);
  };
};

it('Should pick up that "extractDivs" is of type "HTMLDivElement[]"', () => {
  const extractDivs = createDOMNodeExtractor({
    isNode: isDivElement,
    transform: (div) => {
      type test1 = Expect<Equal<typeof div, HTMLDivElement>>;
      return div.innerText;
    },
  });
  const divs = extractDivs([document.createElement("div")]);

  type test2 = Expect<Equal<typeof divs, string[]>>;
});

it('Should pick up that "extractBodies" is of type "HTMLBodyElement[]"', () => {
  const extractBodies = createDOMNodeExtractor({
    isNode: isBodyElement,
    transform: (body) => {
      type test1 = Expect<Equal<typeof body, HTMLBodyElement>>;

      return body.bgColor;
    },
  });

  const bodies = extractBodies([document.createElement("body")]);

  type test2 = Expect<Equal<typeof bodies, string[]>>;
});
