import { z } from "zod";

export const ProductSchema = z.object({
    id:z.string(),
    title:z.string().min(3,{message:'Title must be at least 3 characters'}),
    image:z.string().url({message:'Image is required'}),
    price:z.coerce.number().gt(0,{message:'Price must be greater than 0'}),
    stock:z.coerce.number().gte(0,{message:'Stock must be greater than or equal to 0'}),
})

export type IProduct = z.infer<typeof ProductSchema>

export const AddProductSchema = ProductSchema.omit({id:true})


export type ICartProduct = {
    id:string,
    title:string,
    image:string,
    price:number,
    quantity:number
}

