export interface ObjectContext<T extends {}>{
  readonly __isInitialized: boolean;
  readonly __setValue:<E extends {}>(item: E)=> void;
  readonly __toJson: ()=> string;
  readonly __cleanItem: ()=> string;
 }
 
 declare const CreateContext: <T>(item: T, hierarkiTree?: boolean, ignoreObjectKeyNames?:string[], keyTimeout?: number) => ObjectContext<T> & T;
 export default CreateContext;