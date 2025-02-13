import type { NextApiRequest, NextApiResponse } from 'next';
// Replace this with your actual data fetching logic, e.g., using Prisma.
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  try {
    const clients = await prisma.user.findMany();
    return res.status(200).json(clients);
  } catch (error) {
    console.error('Error fetching clients', error);
    return res.status(500).json({ error: 'Error fetching clients' });
  }
} 