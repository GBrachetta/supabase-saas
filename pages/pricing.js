import initStripe from 'stripe';

import { useUser } from '../context/user';

const Pricing = ({ sortedPlans }) => {
  const { isLoading, login, user } = useUser();

  const showSubscribeButton = !!user && !user.is_subscribed;
  const showCreateAccountButton = !user;
  const showManageSubscriptionButton = !!user && user.is_subscribed;

  return (
    <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
      {sortedPlans.map((plan) => (
        <div key={plan.id} className="w-80 h-40 rounded shadow px-6 py-4">
          <h2 className="text-xl">{plan.name}</h2>
          <div className="text-gray-500">
            ${plan.price / 100} / {plan.interval}
          </div>

          {!isLoading && (
            <div>
              {showSubscribeButton && <button type="button">Subscribe</button>}
              {showCreateAccountButton && (
                <button onClick={login} type="button">
                  Create Account
                </button>
              )}
              {showManageSubscriptionButton && (
                <button type="button">Manage Subscription</button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const getStaticProps = async () => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product);

      return {
        currency: price.currency,
        id: price.id,
        interval: price.recurring.interval,
        name: product.name,
        price: price.unit_amount,
      };
    }),
  );

  const sortedPlans = plans.sort((a, b) => a.price - b.price);

  return {
    props: {
      sortedPlans,
    },
  };
};

export default Pricing;
