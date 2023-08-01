import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { Dialog } from "@mui/material";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { lightBlue } from "@mui/material/colors";

const settings = [
  { name: "Profile", link: "/profile" },
  { name: "Logout", link: "/logout" },
];

const pages = [
  // { name: "Home", link: "/admin" },
  // { name: "Profile", link: "/profile" },
]

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [openLogoutAlert, setOpenLogoutAlert] = React.useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : "user";

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    setOpenLogoutAlert(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setOpenLogoutAlert(false);
    navigate("/login");
  };

  const handleCancelLogout = () => {
    setOpenLogoutAlert(false);
  };

  return (
    <React.Fragment>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 800,
                letterSpacing: ".1rem",
                color: "inherit",
                fontSize: "1.1rem",
                textDecoration: "none",
              }}
            >
              Exam Hub
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <RouterLink
                    to={page.link}
                    style={{ textDecoration: "none" }}
                    key={page.name}
                  >
                    <MenuItem onClick={handleCloseNavMenu}>
                      {page.name}
                    </MenuItem>
                  </RouterLink>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: "1.0rem",
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Exam Hub
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <RouterLink
                  to={page.link}
                  style={{ textDecoration: "none" }}
                  key={page.name}
                >
                  <Button
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page.name}
                  </Button>
                </RouterLink>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Typography
                variant="body1"
                sx={{ ml: 2, color: lightBlue[800], display: { xs: "none", md: "block" }, color: "white", fontWeight: "bold" }}
              >
                {username}
              </Typography>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <RouterLink
                    to={setting.link}
                    style={{ textDecoration: "none" }}
                    key={setting.name}
                  >
                    {setting.name === "Logout" ? (
                      <Button
                        sx={{ color: lightBlue[800], display: "block", }}
                        onClick={handleLogout}
                      >
                        {setting.name}
                      </Button>
                    ) : (
                      <Button sx={{ color: lightBlue[800], display: "block" }}>
                        {setting.name}
                      </Button>
                    )}
                  </RouterLink>
                ))}
              </Menu>
              <Dialog open={openLogoutAlert} onClose={handleCancelLogout}>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to logout?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCancelLogout}>Cancel</Button>
                  <Button onClick={handleConfirmLogout} autoFocus>
                    Logout
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </React.Fragment>
  );
}
export default ResponsiveAppBar;
