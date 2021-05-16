export type PropertyDescriptorDecorator = (
  target: Record<string, any>,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => PropertyDescriptor;

export type VoidDecorator = (target: Record<string, any>, propertyKey: string, descriptor: PropertyDescriptor) => void;
