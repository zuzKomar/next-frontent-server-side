import { PageContainer } from '../components/PageContainer';
import { GetServerSidePropsContext } from 'next';
import SelectedCarInfo from './components/selectedCarInfo';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import IndexPage from '../Head';
import { Car } from '../types/Car';

export interface CarPageProps {
    data: Car
}

export default function CarPage({data}: CarPageProps){
    return(
        <PageContainer>
          <IndexPage />
            <SelectedCarInfo data={data} />
        </PageContainer>
    )
}

export async function getServerSideProps (context: GetServerSidePropsContext){
    try {
        const session: Session | null = await getSession({req: context.req});

        if(!session) {
            return {
              redirect: {
                destination: '/auth/signin',
                permanent: false
              }
            }
          }else {
            const {user} = session;
            const token = user?.accessToken || '';
            const car = await getCar(context.params!.id[0], token!);
          
            return { 
              props: { 
                data: car
              } 
            }
          }

    }catch(err){
        console.log(err);
    }
};

export async function getCar(carId: string, token: string) {
    const response = await fetch(`${process.env.NEST_URL}cars/${carId}`, 
    {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();
    return data;
  }