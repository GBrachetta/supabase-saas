import Link from 'next/link';

import { supabase } from '../utils/supabase';

const Home = ({ lessons }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      {lessons.map((lesson) => (
        <Link key={lesson.id} href={`/${lesson.id}`}>
          <a className="p-8 h-40 mb-4 rounded shadow text-xl flex">
            {lesson.title}
          </a>
        </Link>
      ))}
    </div>
  );
};

export const getStaticProps = async () => {
  const { data: lessons } = await supabase.from('lesson').select('*');

  return {
    props: {
      lessons,
    },
  };
};

export default Home;
