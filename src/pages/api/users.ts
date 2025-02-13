import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  try {
    const count = await prisma.user.count();
    return res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching user count: ", error);
    return res.status(500).json({ error: 'Failed to fetch user count' });
  }
} 