export interface ObjectContext<T extends {}>{
    __isInitialized: boolean;
    setValue:<E extends {}>(item: E)=> void;
  }
  
  declare const CreateContext: <T>(item: T) => ObjectContext<T> & T;
  export default CreateContext;