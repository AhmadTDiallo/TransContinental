import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      await prisma.shipment.delete({
        where: { id: id as string },
      });
      return res.status(200).json({ message: 'Shipment deleted successfully' });
    } catch (error) {
      console.error('Error deleting shipment:', error);
      return res.status(500).json({ error: 'Failed to delete shipment' });
    }
  } else if (req.method === 'PUT') {
    const { status } = req.body;

    if (status !== 'ACCEPTED' && status !== 'DECLINED') {
      return res.status(400).json({ error: 'Invalid status' });
    }

    try {
      await prisma.shipment.update({
        where: { id: id as string },
        data: { status } as any,
      });
      return res.status(200).json({ message: 'Shipment updated successfully' });
    } catch (error) {
      console.error('Error updating shipment:', error);
      return res.status(500).json({ error: 'Failed to update shipment' });
    }
  } else {
    res.setHeader('Allow', ['DELETE', 'PUT']);
    return res
      .status(405)
      .json({ error: `Method ${req.method} Not Allowed` });
  }
} 