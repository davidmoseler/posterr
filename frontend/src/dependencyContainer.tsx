/*
  Combines a Inversion of Control (IoC) container with React hooks.

  It can be used like this:

    dependencyContainer.register('SomeComponent', () => {
        const user = useSelector((state) => state.currentUser);
        return { user }
    })

    const SomeComponent = () => {
        const {user} = useDependencies('SomeComponent');
        return <div>user.name</div>
    }

    export default SomeComponent;

  to refactor a component that would otherwise look like this:

    const SomeComponent = () => {
      const user = useSelector((state) => state.currentUser);
      return <div>user.name</div>
    }

    export default SomeComponent;

  to make sure that dependencies are being injected and enhance testability.

  Make sure to wrap the components in a provider:

    <ContainerProvider container={dependencyContainer}>
      <SomeComponent />
    </ContainerProvider>
*/

import React, { createContext, useContext } from 'react';

const dependencyContainer: {
  registry: any;
  register: Function;
  resolve: Function;
} = {
  registry: {},
  register(componentName: string, dependenciesHook: Function) {
    if (!this.registry.hasOwnProperty(componentName)) {
      this.registry[componentName] = dependenciesHook;
    }
  },
  resolve(componentName: string) {
    if (!this.registry.hasOwnProperty(componentName)) {
      throw new Error(
        `Hook with identifier ${componentName} not found in container`
      );
    }
    return this.registry[componentName];
  },
};

const ContainerContext = createContext(dependencyContainer);

const ContainerProvider = ({
  container,
  children,
}: {
  container: any;
  children: any;
}) => {
  return (
    <ContainerContext.Provider value={container}>
      {children}
    </ContainerContext.Provider>
  );
};

const useDependencyContainer = () => {
  const container = useContext(ContainerContext);
  if (!container) {
    throw new Error(
      'Container not found. Make sure to wrap your components with a ContainerProvider.'
    );
  }
  return container;
};

const useDependencies = (componentName: string, args: any = {}) => {
  const container = useDependencyContainer();
  return container.resolve(componentName)(args);
};

export { dependencyContainer, ContainerProvider, useDependencies };
