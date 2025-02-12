import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import type { User } from '@prisma/client';

const prisma = new PrismaClient();

// Module augmentation for next-auth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: 'client' | 'admin';
      companyName?: string;
      isSuperAdmin?: boolean;
    };
  }

  interface User {
    role: 'client' | 'admin';
    companyName?: string;
    isSuperAdmin?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'client' | 'admin';
    companyName?: string;
    isSuperAdmin?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Client login (User table)
    CredentialsProvider({
      id: "client-login",
      name: "Client",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req): Promise<User | null> {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (!user) throw new Error('No account found');
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) throw new Error('Invalid password');

        return { 
          id: user.id, 
          email: user.email, 
          role: 'client', 
          companyName: user.companyName || undefined 
        };
      }
    }),

    // Admin login (Admin table)
    CredentialsProvider({
      id: "admin-login",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials.password) return null;

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email }
        });
        
        if (!admin) throw new Error('Admin account not found');
        const isValid = await compare(credentials.password, admin.password);
        if (!isValid) throw new Error('Invalid admin credentials');

        return { 
          id: admin.id, 
          email: admin.email, 
          role: 'admin',
          isSuperAdmin: admin.isSuperAdmin
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.companyName = user.companyName;
        token.isSuperAdmin = user.isSuperAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        role: token.role,
        companyName: token.companyName,
        isSuperAdmin: token.isSuperAdmin
      };
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions); 