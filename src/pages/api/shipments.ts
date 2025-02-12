import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { clientName } = req.query;
      const shipments = clientName
        ? await prisma.shipment.findMany({
            where: { clientEmail: String(clientName) },
            orderBy: { createdAt: 'desc' },
          })
        : await prisma.shipment.findMany({ orderBy: { createdAt: 'desc' } });
      res.status(200).json(shipments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch shipments' });
    }
  } else if (req.method === 'POST') {
    const {
      clientEmail,
      billOfLadingFiles,
      packingListFile,
      commercialInvoiceFile,
      containers20ft,
      containers40ft,
    } = req.body;
    if (!clientEmail) {
      return res.status(400).json({ error: 'Missing client email' });
    }
    try {
      const user = await prisma.user.findUnique({
        where: { email: clientEmail },
        select: {
          companyName: true
        }
      });

      if (!user) {
        return res.status(400).json({ 
          error: 'User not found',
          details: `No user registered with email: ${clientEmail}`
        });
      }

      const newShipment = await prisma.shipment.create({
        data: {
          clientName: user.companyName,
          billOfLadingFiles,
          packingListFile,
          commercialInvoiceFile,
          containers20ft,
          containers40ft,
        },
      });
      res.status(201).json(newShipment);
    } catch (error: any) {
      console.error("Error creating shipment:", error);
      res.status(500).json({ error: 'Failed to create shipment', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 