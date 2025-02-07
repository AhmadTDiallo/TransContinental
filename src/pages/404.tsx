import { Box, Button, Container, Typography } from '@mui/material'
import { useRouter } from 'next/router'

export default function Custom404() {
  const router = useRouter()

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h1">404</Typography>
        <Typography variant="h4">Page Not Found</Typography>
        <Button 
          variant="contained" 
          onClick={() => router.push('/')}
        >
          Go Back Home
        </Button>
      </Box>
    </Container>
  )
} 