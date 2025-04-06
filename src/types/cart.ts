export type ICartProduct = {
    id:string,
    title:string,
    image:string,
    price:number,
    quantity:number
}

export type ICartMap = Record<string,Record<string, ICartProduct>>;

export type IUserCartMap = Record<string,ICartProduct>