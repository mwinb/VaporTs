export type PropertyDescriptorDecorator = (
  target: Record<string, any>,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => PropertyDescriptor;

export type VoidDecorator = (target: Record<string, any>, propertyKey: string, descriptor: PropertyDescriptor) => void;

export type PropertyDecorator = (target: any, propertyKey: string) => void;
