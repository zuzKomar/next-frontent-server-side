import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Cell, Column, Row, TableView, TableBody, TableHeader } from '@adobe/react-spectrum';
import { PageContainer } from '../components/PageContainer';
import { useRouter } from 'next/router'
import { getSession } from "next-auth/react";

export interface Car {
  id: number;
  brand: string;
  model: string;
  productionYear: number;
  power: number;
  capacity: number;
  costPerDay: number;
  numberOfSeats: number;
  transmission: string;
  photo: string;
  usable: boolean;
  rents: any[];
}

interface IndexCarsPageProps {
  cars: Car[];
}

export default function Cars({ cars }: IndexCarsPageProps) {
  const router = useRouter();

  let usableCars = cars.filter((el:Car) => el.usable === true)

  let columns = [
    { name: 'Brand', uid: 'brand' },
    { name: 'Model', uid: 'model' },
    { name: 'Year of production', uid: 'productionYear' },
    { name: 'Power', uid: 'power' },
    { name: 'Capacity', uid: 'capacity' },
    { name: 'Cost/day', uid: 'costPerDay' },
  ];

  function selectCarHandler(keys:any){
    router.push(`/cars/${keys.currentKey}`);
  }

  return (
    <PageContainer>
        <h1>Available cars:</h1>
        <TableView
          aria-label="Table with car available for rent"
          flex
          selectionMode="single"
          selectionStyle="highlight"
          alignSelf="center"
          width="70%"
          onSelectionChange={(keys)=>selectCarHandler(keys)}
        >
          <TableHeader columns={columns}>
            {column => (
              <Column key={column.uid} align="center" width="auto">
                {column.name}
              </Column>
            )}
          </TableHeader>
          <TableBody items={usableCars}>
            {(item: any) => <Row>{columnKey => <Cell>{item[columnKey]}</Cell>}</Row>}
          </TableBody>
        </TableView>
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const token = context.req.cookies.token;
  const session = await getSession( {req: context.req} );
  console.log(session); //null if user is not authenticated
  console.log(token);

  if(!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false
      }
    }
  }else {
    console.log('session active')
    const cars = await getCars(token!);
  
    return { 
      props: { 
        cars: cars, 
        session 
      } 
    };
  }
}


export async function getCars(token: string) {
  const response = await fetch('http://localhost:3000/cars', 
  {
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  });
  const data = await response.json();
  return data;
}