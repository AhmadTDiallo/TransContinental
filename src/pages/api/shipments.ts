import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const shipments =
        session.user.role === 'client'
          ? await prisma.shipment.findMany({
              where: { clientEmail: session.user.email },
              orderBy: { createdAt: 'desc' },
            })
          : await prisma.shipment.findMany({ orderBy: { createdAt: 'desc' } });
      return res.status(200).json(shipments);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch shipments' });
    }
  } else if (req.method === 'POST') {
    const {
      billOfLadingFiles,
      packingListFile,
      commercialInvoiceFile,
      containers20ft,
      containers40ft,
    } = req.body;
    const clientEmail =
      session.user.role === 'client'
        ? session.user.email
        : req.body.clientEmail;
    if (!clientEmail) {
      return res.status(400).json({ error: 'Missing client email' });
    }
    try {
      const user = await prisma.user.findUnique({
        where: { email: clientEmail },
        select: { companyName: true },
      });
      if (!user) {
        return res.status(400).json({
          error: 'User not found',
          details: `No user registered with email: ${clientEmail}`,
        });
      }
      const newShipment = await prisma.shipment.create({
        data: {
          clientEmail,
          clientName: user.companyName,
          billOfLadingFiles,
          packingListFile,
          commercialInvoiceFile,
          containers20ft,
          containers40ft,
        },
      });
      return res.status(201).json(newShipment);
    } catch (error: any) {
      console.error('Error creating shipment:', error);
      return res.status(500).json({
        error: 'Failed to create shipment',
        details: error.message,
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 