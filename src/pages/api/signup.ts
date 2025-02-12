import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

interface SignupRequestBody {
  name: string;
  email: string;
  password: string;
  companyName?: string;
  phoneNumber?: string;
  companyAddress?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Debug request body
  console.log('Request body:', req.body);

  // Validate request body
  if (!req.body) {
    return res.status(400).json({ message: 'Request body is missing' });
  }

  try {
    const { 
      name, 
      email, 
      password,
      companyName,
      phoneNumber,
      companyAddress,
      city,
      country,
      postalCode
    } = req.body as SignupRequestBody;
    
    // Debug parsed data
    console.log('Parsed data:', { name, email, password: '***' });

    // Validate required fields
    if (!name || !email || !password || !companyName) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          companyName: !companyName ? 'Company name is required' : null
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Debug database connection
    console.log('Checking for existing user...');
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Debug user creation
    console.log('Creating new user...');
    
    // Create new user
    const hashedPassword = hashSync(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name?.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        companyName: companyName.trim(),
        phoneNumber: phoneNumber?.trim(),
        companyAddress: companyAddress?.trim(),
        city: city?.trim(),
        country: country?.trim(),
        postalCode: postalCode?.trim(),
      },
    });

    console.log('User created successfully:', { id: user.id, email: user.email });

    // Return success response
    return res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

  } catch (error) {
    console.error('Detailed signup error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    await prisma.$disconnect();
  }
}
