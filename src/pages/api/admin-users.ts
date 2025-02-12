import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const admins = await prisma.admin.findMany();
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch admin users' });
    }
  } else if (req.method === 'POST') {
    const { name, email, password, isSuperAdmin } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
      const existingAdmin = await prisma.admin.findUnique({
        where: { email },
      });
      if (existingAdmin) {
        return res.status(400).json({ error: 'Admin with this email already exists' });
      }
      
      const hashedPassword = bcrypt.hashSync(password, 12);
      const newAdmin = await prisma.admin.create({
        data: {
          name,
          email,
          password: hashedPassword,
          isAdmin: true,
          isSuperAdmin: Boolean(isSuperAdmin),
        },
      });
      res.status(201).json(newAdmin);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create admin user' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 