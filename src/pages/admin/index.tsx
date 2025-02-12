import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AdminLogin from './login';

const AdminIndex = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If an admin is already authenticated, redirect to the dashboard.
  useEffect(() => {
    if (status === "authenticated" && session?.user.role === 'admin') {
      router.push('/admin/admin_dashboard');
    }
  }, [session, status, router]);

  return <AdminLogin />;
};

export default AdminIndex; 