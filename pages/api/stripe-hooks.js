import { buffer } from 'micro';
import initStripe from 'stripe';

import { getServiceSupabase } from '../../utils/supabase';

export const config = { api: { bodyParser: false } };

const handler = async (req, res) => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers['stripe-signature'];
  const signingSecret = process.env.STRIPE_SIGNING_SECRET;
  const reqBuffer = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
  } catch (error) {
    console.log(error);

    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  const supabase = getServiceSupabase();

  switch (event.type) {
    case 'customer.subscription.updated':
      await supabase
        .from('profile')
        .update({
          interval: event.data.object.items.data[0].plan.interval,
          is_subscribed: true,
        })
        .eq('stripe_customer', event.data.object.customer);
      break;

    case 'customer.subscription.deleted':
      await supabase
        .from('profile')
        .update({
          interval: null,
          is_subscribed: false,
        })
        .eq('stripe_customer', event.data.object.customer);
      break;

    default:
      return;
  }

  res.send({ received: true });
};

export default handler;
