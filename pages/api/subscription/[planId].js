import cookie from 'cookie';

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

  res.send({
    ...user,
    stripe_customer,
  });
};

export default handler;
