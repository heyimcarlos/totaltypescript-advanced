import React from "react";

/**
 * How do we add a new base element to React's JSX?
 *
 * You'll need to do some detective work: check
 * out JSX.IntrinsicElements.
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "custom-element": {
        propOne: string;
        children: React.ReactNode;
      };
    }
  }
}
const element = <custom-element propOne="helloWorld">hello world</custom-element>;
