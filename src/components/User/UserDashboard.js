import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import AdbIcon from "@mui/icons-material/Adb";
import PersonIcon from '@mui/icons-material/Person';
import Avatar from "@mui/material/Avatar";
import { useEffect } from 'react';
import Tooltip from "@mui/material/Tooltip";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { CardMedia, Dialog} from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useState } from 'react';
import { Routes, useNavigate, Link as RouterLink, Route } from 'react-router-dom';
import { lightBlue } from "@mui/material/colors";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { QuizInstructionPage } from './QuizInstructionPage';


export function UserDashboard() {
  const navigate = useNavigate();
  const host = "http://localhost:8080";
  const [categories, setCategories] = useState([]);
  const [quizes, setQuizes] = useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [showQuizInstructions, setShowQuizInstructions] = useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [activeQuizzes, setActiveQuizzes] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categoryQuizzes, setCategoryQuizzes] = useState([]);
  const [openLogoutAlert, setOpenLogoutAlert] = React.useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user.username : "user";

  const fetchAllQuizzes = async () => {
    try {
      const response = await fetch(host + "/generate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
          password: "password",
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem('token', token);

        const resp = await fetch(host + "/quiz/active", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
          },
        });

        if (resp.status === 200) {
          const data = await resp.json();
          setQuizes(data);
          console.log(quizes);
        }
      } else {
        // handleSnackbarOpen("Invalid Details No user found!","error");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const fetchQuizzesById = async (categoryId) => {
    try {
      const response = await fetch(host + "/generate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
          password: "password",
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem('token', token);

        const resp = await fetch(host + "/quiz/category/active/" + categoryId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
          },
        });

        if (resp.status === 200) {
          const data = await resp.json();
          setCategoryQuizzes(data);
          console.log(categoryQuizzes);
        }
      } else {
        // handleSnackbarOpen("Invalid Details No user found!","error");
      }
    } catch (error) {
    }
  }

  const fetchData = async () => {
    try {
      const response = await fetch(host + "/generate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
          password: "password",
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem('token', token);

        const resp = await fetch(host + "/category/", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
          },
        });

        if (resp.status === 200) {
          const data = await resp.json();
          setCategories(data);
        }
      } else {
        // handleSnackbarOpen("Invalid Details No user found!","error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAllQuizzes();
    setSelectedIndex(-1);

    return () => {
      // Cleanup logic here
    };
  }, []);

  useEffect(() => {
    if (selectedCategoryId !== null) {
      fetchQuizzesById(selectedCategoryId);
    }
  }, [selectedCategoryId]);


  useEffect(() => {
    if (selectedIndex === -1) {
      setActiveQuizzes(quizes.filter((q) => q.active));
    } else if (categoryQuizzes.length > 0) {
      setActiveQuizzes(categoryQuizzes.filter((q) => q.active));
    }
  }, [selectedIndex, quizes, categoryQuizzes]);


  const handleListItemClick = async (index, path) => {
    setSelectedIndex(index);
    if (index === -1) {
      fetchAllQuizzes();
      setSelectedCategoryId(null);
    } else {
      const selectedCategory = categories[index];
      setSelectedCategoryId(selectedCategory['cid'])
      console.log(selectedCategoryId);
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
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

  const settings = [
    { name: "Profile", link: "/profile" },
    { name: "Logout", link: "/logout" },
  ];

  const handleStart = (qid) =>()=>{
    console.log(qid)
    setShowQuizInstructions(true);
    navigate(`instructions/${qid}`);
  }

  const drawerWidth = 240;

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="body1"
                sx={{ mr: 2, color: lightBlue[800], display: { xs: "none", md: "block" }, fontWeight: "bold" }}
              >
                {username}
              </Typography>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, color: 'white' }}>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </IconButton>
              </Tooltip>
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
                        sx={{ color: lightBlue[800], display: "block" }}
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
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItemButton
                onClick={() => handleListItemClick(-1, "/")} // Fetch and display all quizzes when the "Home" item is clicked
                selected={selectedIndex === -1}
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
              {categories.map((category, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => handleListItemClick(index, `/category/${category.cid}`)} // Replace '/category/${category.id}' with the appropriate path for your application
                  selected={selectedIndex === index}
                >
                  <ListItemText primary={category.title} />
                </ListItemButton>
              ))}
            </List>
            <Divider />
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Routes>
            {/* <Route path="/profile" element={<ProfilePage />} /> */}
            <Route path="/instructions/:qid" element={<QuizInstructionPage/>}/>
          </Routes>

          <Grid container spacing={1}>
            {!showQuizInstructions &&
              (selectedIndex === -1
              ? (quizes.map((q) => (
                <Grid item key={q.qid} xs={8} sm={6} md={4} lg={3} my={2}>
                  <Card sx={{
                    boxShadow: 5, borderRadius: 5, transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                    width: 300
                  }}>
                    <CardMedia
                      component="img"
                      height="80"
                      image='   https://cdn-icons-png.flaticon.com/512/8776/8776742.png '
                    />
                    <CardContent sx={{ backgroundColor: '#f5f5f5' }}>
                      <Typography variant='h6'>{q.title}</Typography>
                      <Typography variant="subtitle1">Category: {q.category.title}</Typography>
                      <Typography variant="body2">{q.description}</Typography>
                      <Grid container spacing={1} justifyContent="flex-start" alignItems="center">
                        <Grid item>
                          <Button variant='text'>Questions - {q.numberOfQuestions}</Button>
                        </Grid>
                        <Grid item>
                          <Button variant='text'>Marks - {q.maxMarks}</Button>
                        </Grid>
                        <Grid item>
                          <Button variant='outlined'>View</Button>
                        </Grid>
                        <Grid item>
                          <Button variant='contained' onClick={handleStart(q.qid)}>Start</Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))

              ): categoryQuizzes.length >0?( 
                categoryQuizzes.map((q) => (
                <Grid item key={q.qid} xs={8} sm={6} md={4} lg={3} >
                <Card sx={{
                  boxShadow: 5, borderRadius: 5, transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                  width: 300
                }}>
                  <CardMedia
                    component="img"
                    height="80"
                    image='   https://cdn-icons-png.flaticon.com/512/8776/8776742.png '
                  />
                  <CardContent sx={{ backgroundColor: '#f5f5f5' }}>
                    <Typography variant='h6'>{q.title}</Typography>
                    <Typography variant="subtitle1">Category: {q.category.title}</Typography>
                    <Typography variant="body2">{q.description}</Typography>
                    <Grid container spacing={1} justifyContent="flex-start" alignItems="center">
                      <Grid item>
                        <Button variant='text'>Questions - {q.numberOfQuestions}</Button>
                      </Grid>
                      <Grid item>
                        <Button variant='text'>Marks - {q.maxMarks}</Button>
                      </Grid>
                      <Grid item>
                        <Button variant='outlined'>View</Button>
                      </Grid>
                      <Grid item>
                        <Button variant='contained' onClick={handleStart(q.qid)}>Start</Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              ))
              ):(
                <Grid item xs={12}>
                <Typography variant="h6" align="center">
                  No data available in this category.
                </Typography>
              </Grid>
              ))
            }
          </Grid>

        </Box>
      </Box>
    </>
  );
}
