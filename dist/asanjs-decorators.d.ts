declare module 'asanjs-decorators' {
  export function isDescriptor(desc: any): any;
  export function decorate(handleDescriptor: any, entryArgs: any): any;
  export function accessor(options: any): any;
  export function attribute(options: any): any;
  export function customElement(): any;
  export default undefined;
  export function lifeCycleEventHandler(): any;
  export function method(): any;
}