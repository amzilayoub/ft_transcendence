import React from "react";

import dynamic from "next/dynamic";

const NoSsr = (props: {
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}) => <React.Fragment>{props.children}</React.Fragment>;

export default dynamic(() => Promise.resolve(NoSsr), {
  ssr: false,
});
