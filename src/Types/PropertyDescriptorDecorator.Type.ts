export type PropertyDescriptorDecorator = (
  target: Record<string, any>,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => PropertyDescriptor;
