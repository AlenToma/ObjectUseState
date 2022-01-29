export interface ObjectContext<T extends {}>{
  readonly __isInitialized: boolean;
  readonly __setValue:<E extends {}>(item: E)=> void;
  readonly __toJson: ()=> string;
 }
 
 declare const CreateContext: <T>(item: T) => ObjectContext<T> & T;
 export default CreateContext;