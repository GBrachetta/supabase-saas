/* eslint-disable camelcase */
import cookie from 'cookie';
import initStripe from 'stripe';

import { supabase } from '../../../utils/supabase';

const handler = async (req, res) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  const token = cookie.parse(req.headers.cookie)['sb-access-token'];

  supabase.auth.session = () => ({
    access_token: token,
  });

  const {
    data: { stripe_customer },
  } = await supabase
    .from('profile')
    .select('stripe_customer')
    .eq('id', user.id)
    .single();

  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const { planId } = req.query;

  const lineItems = [
    {
      price: planId,
      quantity: 1,
    },
  ];

  const session = await stripe.checkout.sessions.create({
    cancel_url: `${process.env.CLIENT_URL}/payment/cancelled`,
    customer: stripe_customer,
    line_items: lineItems,
    mode: 'subscription',
    payment_method_types: ['card'],
    success_url: `${process.env.CLIENT_URL}/payment/success`,
  });

  res.send({
    id: session.id,
  });
};

export default handler;
