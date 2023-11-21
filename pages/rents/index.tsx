import { PageContainer } from '../../components/PageContainer';
import {
  Cell,
  Column,
  Row,
  TableView,
  TableBody,
  TableHeader,
  Button,
  Header,
} from '@adobe/react-spectrum';
import { GetServerSidePropsContext } from 'next';
import { days } from '../cars/components/rentModal';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import { Rent } from '../../types/Rent';
import IndexPage from '../Head';

type RentsPageProps = {
  rents: Rent[];
};

export default function Rents({ rents }: RentsPageProps) {
  const router = useRouter();
  const session = useSession();
  const token = session.data?.user!.accessToken || '';

  const columns = [
    { name: 'Car', uid: 'car' },
    { name: 'Date from', uid: 'date' },
    { name: 'Date to', uid: 'dueDate' },
    { name: 'Cost', uid: 'cost' },
    { name: 'Damaged', uid: 'damagedCar' },
    { name: 'Options', uid: 'reportDamage' },
  ];

  const modifiedRents =
    rents.length > 0
      ? rents.map(rent => ({
          ...rent,
          car: rent.car.brand + ' ' + rent.car.model,
          date: new Date(rent.date).toISOString().slice(0, 10),
          dueDate: new Date(rent.dueDate).toISOString().slice(0, 10),
          cost: days(new Date(rent.dueDate), new Date(rent.date)) * rent.car.costPerDay,
          damagedCar: rent.damagedCar === false ? 'No' : 'Yes',
          reportDamage: 'yes',
        }))
      : [];

  function handleDamageReport(rentId: number) {
    const updateRentDto = {
      damagedCar: true,
    };

    fetch(`http://localhost:3000/rents/${rentId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateRentDto),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(() => router.push(`/rents`))
      .catch(e => console.log(e));
  }

  return (
    <PageContainer>
      <IndexPage />
      <h1>Your rents</h1>

      {modifiedRents.length > 0 ? (
        <TableView
          aria-label="Table with your rents"
          flex
          selectionMode="single"
          selectionStyle="highlight"
          alignSelf="center"
          width="100%"
        >
          <TableHeader columns={columns}>
            {column => (
              <Column key={column.uid} align="center" width="100%">
                {column.name}
              </Column>
            )}
          </TableHeader>
          <TableBody items={modifiedRents}>
            {(item: any) => (
              <Row>
                {columnKey => (
                  <Cell>
                    {columnKey !== 'reportDamage' ? (
                      item[columnKey]
                    ) : (
                      <Button
                        variant="primary"
                        isDisabled={item.damagedCar === 'No' ? false : true}
                        onPress={() => handleDamageReport(item.id)}
                      >
                        Report damage
                      </Button>
                    )}
                  </Cell>
                )}
              </Row>
            )}
          </TableBody>
        </TableView>
      ) : (
        <Header>No rents available!</Header>
      )}
    </PageContainer>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const session = await getSession({ req: context.req });
    if (!session) {
      return {
        redirect: {
          destination: '/auth/signin',
          permanent: false,
        },
      };
    } else {
      const token = session!.user!.accessToken || '';
      const rents = await getUserRents(token, session.user.email);
      return { props: { rents: rents } };
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getUserRents(token: string, email: string) {
  const response = await fetch(`${process.env.NEST_URL}users/${email}`, {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
  const data = await response.json();
  return data.rents;
}
