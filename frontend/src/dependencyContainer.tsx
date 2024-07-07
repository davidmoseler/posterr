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
