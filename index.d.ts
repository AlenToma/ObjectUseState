export interface ObjectContext<T extends {}>{
  readonly __isInitialized: boolean;
  readonly setValue:<E extends {}>(item: E)=> void;
 }
 
 declare const CreateContext: <T>(item: T) => ObjectContext<T> & T;
 export default CreateContext;