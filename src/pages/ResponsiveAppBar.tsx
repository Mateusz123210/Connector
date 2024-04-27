import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ConnectorLogo from "../assets/connector_logo_big.png"
import { Grid } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { RegistrationAndLoginStatus } from '../App';


const ResponsiveAppBar = (props: any) => {
    
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = async () => {
        const result = props.logout()
        
        if(await result == true) 
            navigate("/")
    }

    return (
        <Grid container height={110} padding={0.6}  style={{ color: 'white', backgroundColor: '#CBE2EF' }}>
        
            
            <Grid item xs={3}>
                <img
                id="logo"
                src={ConnectorLogo}
                width={100}
                alt="Logo"
                onClick={() => navigate("/")}
                />
            </Grid>
            <Grid item xs={6} >
                    <Typography
                    paddingTop={2}
                    id="pageName"
                    variant="h2"
                    color="#4C87BA"
                    textAlign="center"
                    onClick={() => navigate("/")}
                    >
                    Connector
                    </Typography>
            </Grid>
            <Grid item xs={3} paddingTop={1.0} >

            {props.logged == false && props.blocked == false && <Box display="flex" justifyContent="flex-end" paddingRight={2}>
                    <Button
                        key="Register"
                        onClick={() => navigate("/register")}
                        sx={{ my: 2, fontSize: '24px', color: '#1D6989'}}
                    >
                        Register
                    </Button>
                    <Button
                        
                        key="Login"
                        onClick={() => navigate("/login")}
                        sx={{ my: 2, fontSize: '24px', color: '#1D6989'}}
                    >
                        Login
                    </Button>           
                </Box>
            }

            {props.logged == true && <Box display="flex" justifyContent="flex-end" paddingRight={2}>
                    <Tooltip title="Open settings" arrow >
                    <Button
                        sx={{ my: 2, background:"#E8F7FD", fontSize: '24px', color: '#1D6989'}} 
                        onClick={handleOpenUserMenu}>Logged</Button>
                    </Tooltip>
                    <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    >
                    {/* <MenuItem key="Change password" onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">Change password</Typography>
                    </MenuItem> */}
                    <MenuItem key="Messages" onClick={(e) => navigate("/messages")}>
                        <Typography textAlign="center">Messages</Typography>
                    </MenuItem>
                    <MenuItem key="Logout" onClick={handleLogout}>
                        <Typography textAlign="center">Logout</Typography>
                    </MenuItem>

                    </Menu>
                </Box>
            }
            </Grid>
        </Grid>
    );
}
export default ResponsiveAppBar;