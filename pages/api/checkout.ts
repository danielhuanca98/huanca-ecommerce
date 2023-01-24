import { initMongoose } from '@/lib/mongoose'
import Order from '@/models/Order'
import Product from '@/models/Product'
import type { NextApiRequest, NextApiResponse } from 'next'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    await initMongoose()

    if (req.method != 'POST') {
        res.json('should be a POST request!')
        return;
    }


    const {name, email, address, city} = req.body
    const productsIds = req.body.products.split(',')
    const uniqIds = [...new Set(productsIds)]
    const products = await Product.find({_id:{$in:uniqIds}}).exec()
    
    let line_items = []
    for (let productId of  uniqIds) {
        const quantity = productsIds.filter((id: string) => id === productId).length
        const product = products.find((p => p._id.toString() === productId))
        line_items.push({
          quantity,
          price_data: {
            currency: 'BRL',
            product_data: {name: product.name},
            unit_amount: product.price * 100
          }
        })
    } 

    const order = await Order.create({
      products: line_items,
      name,
      address,
      email,
      city,
      paid: 0
    })

    const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        customer_email: email,
        mode: 'payment',
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        metadata: {orderId: order._id.toString()}
      });
      res.redirect(303, session.url);
}