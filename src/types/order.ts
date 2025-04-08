
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
export type IUserOrderMap = Map<string,IOrder>
export type IOrderMap = Map<string, IUserOrderMap>;
