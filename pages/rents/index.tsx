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
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { days } from '../cars/components/rentModal';
import { useRouter } from 'next/router';
import IndexPage from '../Head';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

export default function Rents({
  rents,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

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

    fetch(`${process.env.NEST_URL}/rents/${rentId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateRentDto),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.token,
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
          UNSAFE_className="cars-tablee"
        >
          <TableHeader columns={columns}>
            {column => (
              <Column key={column.uid} align="center">
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
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session) throw new Error('Missing authenticated user!');
    const user = session?.user;
    const token = user.token || '';
    const email = user.email || '';
    const rents = await getUserRents(token, email);
    const responsee = rents ? [...rents] : [];

    return {
      props: {
        rents: responsee,
        user: session.user,
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

export async function getUserRents(token: string, email: string) {
  const response = await fetch(`${process.env.NEST_URL}/users/${email}`, {
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
  const data = await response.json();
  return data.rents;
}
