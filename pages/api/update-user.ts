import { NextResponse } from 'next/server';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.status(405).send({ message: 'Only PATCH requests allowed' });
    return;
  }

  // not needed in NextJS v12+
  const body = JSON.parse(req.body);

  fetch(`${process.env.NEST_URL}/users/1`, {
    method: 'PATCH',
    body: JSON.stringify(body),
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + 'token',
    },
  });

  const data = await res.json();

  return NextResponse.json(data);
}
