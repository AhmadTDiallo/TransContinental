import { useState, ReactElement } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person,
  ExitToApp,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import Image from 'next/image';

interface MenuItemType {
  label: string;
  icon: ReactElement;
  href: string;
}

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
    handleClose();
  };

  const scrollToSection = (sectionId: string) => {
    if (router.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/#${sectionId}`);
    }
    handleClose();
  };

  const menuItems: MenuItemType[] = [
    {
      label: 'My Profile',
      icon: <PersonIcon />,
      href: '/profile',
    },
    {
      label: 'Dashboard',
      icon: <DashboardIcon />,
      href: '/dashboard',
    },
    {
      label: 'Settings',
      icon: <SettingsIcon />,
      href: '/settings',
    }
  ];

  return (
    <AppBar 
      position="sticky" 
      sx={{
        background: 'rgba(10, 25, 41, 0.8)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(77, 208, 225, 0.2)'
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Image
            src="/TranscontinentalLOGO.png"
            alt="Transcontinental Logo"
            width={30}
            height={30}
            style={{ marginRight: 10 }}
            priority
          />
          <Typography 
            variant="h6" 
            component={Link}
            href="/"
            sx={{ 
              textDecoration: 'none', 
              color: '#4dd0e1',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Trans-Continental
          </Typography>
        </Box>

        {session ? (
          // Logged in menu
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!isMobile && (
              <>
                {menuItems.map((item) => (
                  <Button
                    key={item.href}
                    color="inherit"
                    startIcon={item.icon}
                    onClick={() => router.push(item.href)}
                    sx={{ mr: 2 }}
                  >
                    {item.label}
                  </Button>
                ))}
              </>
            )}
            <IconButton
              onClick={handleMenu}
              color="inherit"
              sx={{ 
                border: '2px solid rgba(77, 208, 225, 0.5)',
                borderRadius: '50%',
                padding: '8px'
              }}
            >
              <Person />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {isMobile && menuItems.map((item) => (
                <MenuItem 
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    handleClose();
                  }}
                >
                  {item.icon}
                  <Typography sx={{ ml: 1 }}>{item.label}</Typography>
                </MenuItem>
              ))}
              <MenuItem onClick={handleSignOut}>
                <ExitToApp sx={{ mr: 1 }} /> Sign Out
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          // Non-logged in menu
          <>
            {/* Desktop Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              <Button 
                onClick={() => scrollToSection('services')}
                sx={{ color: 'text.primary' }}
              >
                Services
              </Button>
              <Button 
                onClick={() => scrollToSection('about')}
                sx={{ color: 'text.primary' }}
              >
                About
              </Button>
              <Button 
                onClick={() => scrollToSection('contact')}
                sx={{ color: 'text.primary' }}
              >
                Contact
              </Button>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="outlined"
                  sx={{
                    borderColor: '#4dd0e1',
                    color: '#4dd0e1',
                    '&:hover': {
                      borderColor: '#26c6da'
                    }
                  }}
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(45deg, #4dd0e1 30%, #26c6da 90%)',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </Box>

            {/* Mobile Menu */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => scrollToSection('services')}>
                  Services
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('about')}>
                  About
                </MenuItem>
                <MenuItem onClick={() => scrollToSection('contact')}>
                  Contact
                </MenuItem>
                <MenuItem onClick={() => router.push('/login')}>
                  Login
                </MenuItem>
                <MenuItem onClick={() => router.push('/signup')}>
                  Sign Up
                </MenuItem>
              </Menu>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;