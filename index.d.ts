export interface ObjectContext<T extends {}>{
  readonly __isInitialized: boolean;
  readonly __setValue:<E extends {}>(item: E)=> void;
  readonly __toJson: ()=> string;
 }
 
 declare const CreateContext: <T>(item: T, hierarkiTree?: boolean, sessionKey?: string, ignoreObjectKeyNames?:string[]) => ObjectContext<T> & T;
 export default CreateContext;