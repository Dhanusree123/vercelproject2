
export type IOrderProduct = {
    id:string,
    title:string,
    image:string,
    price:number,
    quantity:number
}
export type IOrder = {
    id: string;
    items: IOrderProduct[];
};
export type IUserOrderMap = Record<string,IOrder>
export type IOrderMap = Record<string, IUserOrderMap>;
