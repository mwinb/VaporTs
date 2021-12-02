export const generatePath = (...args: string[]) => {
  return args.filter(s => s && s.length).join('/').replace(/\/{2,}/g, '/');
}