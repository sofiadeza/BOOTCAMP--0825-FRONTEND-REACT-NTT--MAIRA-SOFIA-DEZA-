export type Category = string;
export type Product = { id:number; title:string; description:string; price:number; thumbnail:string; stock?:number; category:Category };
export type CartItem = { product: Product; quantity: number };
export type AuthData = { token:string; firstName:string; lastName:string };
