import { PageContainer } from '../components/PageContainer';
import { Cell, Column, Row, TableView, TableBody, TableHeader, Button } from '@adobe/react-spectrum';
import { GetServerSidePropsContext } from 'next';
import { days } from '../cars/components/rentModal';
import { Car } from '../cars';
import { useRouter } from 'next/router'
import { getSession } from "next-auth/react";

export type Rent = {
  id: number;
  userId: number;
  carId: number;
  date: Date;
  dueDate: Date;
  damagedCar: boolean;
  car: Car;
}

type RentsPageProps = {
  rents: Rent[]
}

export default function Rents({rents}: RentsPageProps) {
  const router = useRouter();

  let columns = [
    { name: 'Car', uid: 'car'},
    { name: 'Date from', uid: 'date' },
    { name: 'Date to', uid: 'dueDate' },
    { name: 'Cost', uid: 'cost' },
    { name: 'Damage', uid: 'damagedCar' },
    { name: 'Options', uid: 'reportDamage'}
  ];

  let modifiedRents = rents.length > 0 ? rents.map((rent) =>  (
    {
      ...rent,
      date: new Date(rent.date).toISOString().slice(0,10),
      dueDate: new Date(rent.dueDate).toISOString().slice(0,10),
      car: rent.car.brand + rent.car.model,
      damagedCar : rent.car.usable ? 'No' : 'Yes',
      cost: days(new Date(rent.dueDate), new Date(rent.date)) * rent.car.costPerDay,
      reportDamage: 'yes'
    }
    )): [];

  function handleDamageReport( carId: number){
    let updateCarDto = {
      usable: false
    }
    
    fetch(`${process.env.NEST_URL}cars/${carId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateCarDto),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(() => router.push(`/rents`))
    .catch((e) => console.log(e))
  }

  return (
    <PageContainer>
      <h1>Your rents</h1>
      <TableView
          aria-label="Table with your rents"
          flex
          selectionMode="single"
          selectionStyle="highlight"
          alignSelf="center"
          width="60%"
        >
          <TableHeader columns={columns}>
            {column => (
              <Column key={column.uid} align="center" width="auto">
                {column.name}
              </Column>
            )}
          </TableHeader>
          <TableBody items={modifiedRents}>
            {(item: any) => 
            <Row>{columnKey => <Cell>{ columnKey !== 'reportDamage' ? item[columnKey] : <Button variant='primary' isDisabled={item.damagedCar === 'No' ? false : true} onPress={() => handleDamageReport(item.carId)}>Report damage</Button>}</Cell>}
            </Row>
            }
          </TableBody>
        </TableView>
    </PageContainer>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const session = await getSession( {req: context.req} );
    if(!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false
      }
    }
  }else {
      const token = session!.user!.accessToken || '';
      const rents = await getUserRents(token, session.user.id)

      return { props: { rents : rents} };
  }
  }catch(err){
    console.log(err);
  }
};

export async function getUserRents(token: string, userId: string) {
  const response = await fetch(`${process.env.NEST_URL}users/${userId}`, 
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