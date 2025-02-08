import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import type { ProfileData } from '@/types/profile';

interface ApiError {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Partial<ProfileData> | ApiError>
) {
  const session = await getSession({ req });

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          name: true,
          email: true,
          companyName: true,    
          phoneNumber: true,
          companyAddress: true,
          city: true,
          country: true,
          postalCode: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user as Partial<ProfileData>);
    } catch (error) {
      console.error('Profile fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  if (req.method === 'PUT') {
    console.log('PUT /api/profile - Session:', session);
    if (!session || !session.user?.email) {
      console.error('PUT /api/profile - Unauthorized due to missing session or email');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const data = req.body as Partial<ProfileData>;
      const updatedUser = await prisma.user.update({
        where: { email: session.user.email },
        data: {
          name: data.name,
          companyName: data.companyName,
          phoneNumber: data.phoneNumber,
          companyAddress: data.companyAddress,
          city: data.city,
          country: data.country,
          postalCode: data.postalCode,
        },
        select: {
          name: true,
          email: true,
          companyName: true,
          phoneNumber: true,
          companyAddress: true,
          city: true,
          country: true,
          postalCode: true,
        },
      });
      return res.status(200).json(updatedUser as Partial<ProfileData>);
    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
