import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

//TODO figure out how to pass real token of authenticated user
export default async function handler(req, res) {
  const token = await getToken({ req });
  if (req.method !== 'PATCH') {
    res.status(405).send({ message: 'Only PATCH requests allowed' });
    return;
  }
  console.log('stringified req body: ', JSON.stringify(req.body));

  fetch(`${process.env.NEST_URL}/users/${token.user.id}`, {
    method: 'PATCH',
    body: JSON.stringify(req.body),
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + token.accessToken,
    },
  })
    .then(res => res.json())
    .then(res => {
      console.log(res);
    });

  const data = await res.json();

  return NextResponse.json(data);
}
