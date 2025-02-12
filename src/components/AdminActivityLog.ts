import React, { useEffect, useState, ReactElement } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

interface Activity {
  id: string;
  message: string;
  createdAt: string;
}

const AdminActivityLog = (): ReactElement => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchActivities = async (): Promise<void> => {
      try {
        const res = await fetch('/api/admin-activities');
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP error! Status: ${res.status}, Message: ${text}`);
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await res.text();
          throw new Error(`Expected JSON but got: ${text}`);
        }
        const data: Activity[] = await res.json();
        setActivities(data);
      } catch (err: any) {
        console.error('Error fetching admin activities:', err);
        setError('Failed to fetch admin activities');
      }
    };

    fetchActivities();
    const intervalId = setInterval(fetchActivities, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return React.createElement(
    Box,
    { sx: { mt: 2 } },
    React.createElement(
      Typography,
      { variant: 'h6', sx: { color: '#4dd0e1', mb: 1 } },
      'Recent Activity'
    ),
    error ? React.createElement(Typography, { color: 'error' }, error) : null,
    React.createElement(
      List,
      null,
      activities.map((activity: Activity) =>
        React.createElement(
          ListItem,
          { key: activity.id },
          React.createElement(ListItemText, {
            primary: activity.message,
            secondary: new Date(activity.createdAt).toLocaleString()
          })
        )
      )
    )
  );
};

export default AdminActivityLog;