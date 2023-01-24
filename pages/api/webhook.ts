import { initMongoose } from "@/lib/mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import {buffer} from 'micro'
import Order from "@/models/Order";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
//localhost:3000/api/webhook

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    await initMongoose()
    const signinSecret = process.env.STRIPE_SIGNIN_SECRET

    const payload = await buffer(req);
    const signature = req.headers['stripe-signature']
    const event = stripe.webhooks.constructEvent(payload, signature, signinSecret);

    if(event?.type === 'checkout.session.completed') {
        const metadata = event.data?.object?.metadata
        const paymentStatus = event.data?.object?.payment_status
        if (metadata?.orderId && paymentStatus === 'paid') {
            await Order.findByIdAndUpdate(metadata.orderId, {paid:1})
        }
    }

    res.json('ok')
}

export const config = {
    api: {
        bodyParser: false,
    }
}