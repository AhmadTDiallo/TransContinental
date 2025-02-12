import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

interface Activity {
  id: string;
  message: string;
  createdAt: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Activity[] | { error: string }>) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    // Retrieve the latest shipments, client signups and admin accounts.
    const shipments = await prisma.shipment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const admins = await prisma.admin.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Simulated admin deletion events.
    const adminDeleted = [
      { id: 'admin-deleted-1', email: 'deletedadmin@example.com', createdAt: new Date().toISOString() },
    ];

    // Normalize shipments with specific details.
    const shipmentActivities: Activity[] = shipments.map((s) => ({
      id: `shipment-${s.id}`,
      message: `New shipment from ${s.companyName}: ${s.containers20ft} x 20ft, ${s.containers40ft} x 40ft. Bill of Lading: ${s.billOfLadingFiles && s.billOfLadingFiles.length > 0 ? 'Available' : 'Not provided'}.`,
      createdAt: s.createdAt.toISOString(),
    }));

    // Normalize new client signups.
    const userActivities: Activity[] = users.map((u) => ({
      id: `user-${u.id}`,
      message: `New client signup: ${u.email}${u.companyName ? ` (${u.companyName})` : ''}.`,
      createdAt: u.createdAt.toISOString(),
    }));

    // Normalize admin account creations.
    const adminCreatedActivities: Activity[] = admins.map((a) => ({
      id: `admin-created-${a.id}`,
      message: `Admin account created: ${a.email}.`,
      createdAt: a.createdAt.toISOString(),
    }));

    // Normalize admin deletion events.
    const adminDeletedActivities: Activity[] = adminDeleted.map((d) => ({
      id: d.id,
      message: `Admin account deleted: ${d.email}.`,
      createdAt: d.createdAt,
    }));

    // Combine all activities, sort by creation time (descending), and return the latest 10.
    const allActivities = [
      ...shipmentActivities,
      ...userActivities,
      ...adminCreatedActivities,
      ...adminDeletedActivities,
    ];
    allActivities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const latestActivities = allActivities.slice(0, 10);

    res.status(200).json(latestActivities);
  } catch (error) {
    console.error('Error fetching admin activities:', error);
    res.status(500).json({ error: 'Failed to fetch admin activities' });
  }
} 