export type ICartProduct = {
    id:string,
    title:string,
    image:string,
    price:number,
    quantity:number
}

export type ICartMap = Map<string,IUserCartMap>;

export type IUserCartMap = Map<string,ICartProduct>