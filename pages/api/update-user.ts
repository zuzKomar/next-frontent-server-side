import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextApiRequest, NextApiResponse } from 'next';

//TODO figure out how to pass real token of authenticated user
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  let tmpRespObject = {};
  if (req.method !== 'PATCH') {
    res.status(405).send({ message: 'Only PATCH requests allowed' });
    return;
  }
  console.log('stringified req body: ', JSON.stringify(req.body));

  await fetch(`https://rent-a-car-backend-f130520aafb5.herokuapp.com/users/${token.user.id}`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token.accessToken}`,
    },
    body: JSON.stringify(req.body),
  })
    .then(res => res.json())
    .then(res => {
      console.log('--------dupa--------');
      console.log(res);
      tmpRespObject = { ...tmpRespObject };
      console.log('--------dupa2--------');
      //return res;
    });

  return NextResponse.json(tmpRespObject);
}
