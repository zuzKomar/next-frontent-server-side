import { PageContainer } from '../components/PageContainer';
import { Cell, Column, Row, TableView, TableBody, TableHeader } from '@adobe/react-spectrum';
import { GetServerSideProps } from 'next';
import { days } from '../cars/components/rentModal';

export type Rent = {
  id: number;
  userId: number;
  carId: number;
  date: Date
  dueDate: Date
  damagedCar: boolean
}

type RentsPageProps = {
  rents: Rent[]
}

export default function Rents({rents}: RentsPageProps) {

  let columns = [
    { name: 'Date from', uid: 'date' },
    { name: 'Date to', uid: 'dueDate' },
    { name: 'Cost', uid: 'cost' },
    { name: 'Damage', uid: 'damagedCar' }
  ];

  let modifiedRents = rents.map((rent) =>  (
    {
      ...rent,
      cost: days(new Date(rent.dueDate), new Date(rent.date))
    }
    ));

  return (
    <PageContainer>
      <h1>Your rents</h1>
      <TableView
          aria-label="Table with previous rents"
          flex
          selectionMode="single"
          selectionStyle="highlight"
          alignSelf="center"
          width="70%"
          onSelectionChange={()=>console.log('test')}
        >
          <TableHeader columns={columns}>
            {column => (
              <Column key={column.uid} align="center" width="auto">
                {column.name}
              </Column>
            )}
          </TableHeader>
          <TableBody items={modifiedRents}>
            {(item: any) => <Row>{columnKey => <Cell>{item[columnKey]}</Cell>}</Row>}
          </TableBody>
        </TableView>
    </PageContainer>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/users/1');
  const data2 = await res.json();

  return { props: { rents : data2.rents } };
};