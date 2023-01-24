import type { NextApiRequest, NextApiResponse } from 'next'
import { initMongoose } from "@/lib/mongoose";
import Product from "@/models/Product";
import { IProduct } from '@/models/Product';

export async function findAllProducts(): Promise<IProduct[]> {
  return Product.find().exec()
}

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    await initMongoose();
    const {ids} = req.query
    if (ids) {
      const idsArray = ids.toString().split(',')
      res.json( await Product.find({'_id': {$in:idsArray}}).exec())
    } else {
      res.json( await findAllProducts() )
    }
}