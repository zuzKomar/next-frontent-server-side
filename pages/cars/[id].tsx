import { PageContainer } from '../../components/PageContainer';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import SelectedCarInfo from './components/selectedCarInfo';
import { getServerSession } from 'next-auth';
import IndexPage from '../Head';
import { authOptions } from '../api/auth/[...nextauth]';

export default function CarPage({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <PageContainer>
      <IndexPage />
      <SelectedCarInfo data={data} />
    </PageContainer>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session) throw new Error('Missing authenticated user!');

    const user = session?.user;
    const token = user.token || '';
    const car = await getCar(context.params!.id[0], token!);

    return {
      props: {
        data: car,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        destination: '/auth/signin',
        statusCode: 307,
      },
    };
  }
}

export async function getCar(carId: string, token: string) {
  const response = await fetch(`${process.env.NEST_URL}/cars/${carId}`, {
    mode: 'cors',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
  const data = await response.json();
  return data;
}
