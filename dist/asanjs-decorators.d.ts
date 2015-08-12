declare module 'asanjs-decorators' {
  import { Registry }  from 'asanjs-registry';
  export function isDescriptor(desc: any): any;
  export function decorate(handleDescriptor: any, entryArgs: any): any;
  export function accessor(options: any): any;
  export function attribute(options: any): any;
  export function customElement(): any;
  export function deprecate(): any;
  export function eventHandler(): any;
  export function lifeCycleEventHandler(): any;
  export function method(): any;
}