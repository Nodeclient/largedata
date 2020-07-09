declare const router: import("express-serve-static-core").Router;
declare var reject: (t: any) => void;
declare var formdata: (Options: any, call: CallableFunction) => void;
export { router, formdata, reject };
