import { PageContainer } from '../components/PageContainer';
import { GetServerSideProps } from 'next';
import { Car } from '.';
import SelectedCarInfo from './components/selectedCarInfo';

export interface CarPageProps {
    data: Car
}

function CarPage({data}: CarPageProps){

    return(
        <PageContainer>
            <SelectedCarInfo data={data} />
        </PageContainer>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`http://localhost:3000/cars/${context.params!.id}`);
  const data = await res.json();
  return { props: { data } };
};

export default CarPage