import React, { useEffect, useRef } from 'react';

export default (callback: () => any, deps: { [key: string]: any }) => {
  const refs: { current: { [key: string]: any } } = useRef(deps);
  useEffect(() => {
    if (
      Object.keys(deps)
        .map((key: string) => refs.current[key] != deps[key])
        .some((v: boolean) => v)
    ) {
      callback();
    }
    Object.keys(deps).forEach((key: string) => {
      refs.current[key] = deps[key];
    });
  }, Object.values(deps));
};