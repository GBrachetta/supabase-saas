import { useUser } from '../context/user';
import { supabase } from '../utils/supabase';

const Dashboard = () => {
  const { isLoading, user } = useUser();

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-8">
      <h1 className="text-3xl mb-6">Dashboard</h1>
      {!isLoading && (
        <p className="mb-6">
          {user?.is_subscribed
            ? `Subscribed: ${user.interval}`
            : 'Not subscribed'}
        </p>
      )}
    </div>
  );
};

export const getServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);

  if (!user) {
    return {
      props: {},
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Dashboard;
