import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import AddBoxIcon from '@mui/icons-material/AddBox';
import QuizIcon from '@mui/icons-material/Quiz';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { ProfilePage } from './Profile';
import { ViewCategoryPage } from './ViewCategories';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AddCategoryPage from './AddCategoryPage';
import { AddQuizPage } from './AddQuiz';
import { ViewQuizPage } from './ViewQuizzes';
import UpdateQuizPage from './UpdateQuizPage';
import ViewQuestionPage from './ViewQuestion';
import AddQuestionPage from './AddQuestionPage';
import UpdateQuestionPage from './UpdateQuestion';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (index, path) => {
    setSelectedIndex(index);
    navigate(path);
  };

  const iconList = [
    <HomeIcon />,
    <PersonIcon />,
    <CategoryIcon />,
    <AddBoxIcon />,
    <QuizIcon />,
    <AddCircleIcon />,
    <LogoutIcon />
  ];

  const textList = ['Home', 'Profile', 'Categories', 'Add Categories', 'Quizzes', 'Add Quiz', 'Logout'];
  const pathList = ['/admin', '/admin/profile', '/admin/categories', '/admin/add-category', '/admin/quizzes', '/admin/add-quiz', '/logout'];

  const drawerWidth = 240;
  

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Exam Hub
            </Typography>
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
              {textList.map((text, index) => (
                <ListItem
                  key={text}
                  disablePadding
                  selected={selectedIndex === index}
                  onClick={() => handleListItemClick(index, pathList[index])}
                >
                  <ListItemButton>
                    <ListItemIcon style={{ color: '#2196f3' }}>{iconList[index]}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Routes>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/categories" element={<ViewCategoryPage />} />
            <Route path="/add-category" element={<AddCategoryPage/>} />
            <Route path='/add-quiz' element={<AddQuizPage/>}/>
            <Route path='/quizzes/*' element={<ViewQuizPage/>}/>
            <Route path='/quiz/:id' element={<UpdateQuizPage/>} />
            <Route path='/:name/question/:id' element={<UpdateQuestionPage/>}/>
            <Route path='/view-questions/:id/:name' element={<ViewQuestionPage/>}/>
            <Route path='/add-question/:id' element={<AddQuestionPage/>}/>
          </Routes>
        </Box>
      </Box>
    </>
  );
}
