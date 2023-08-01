import logo from './logo.svg';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import RegisterPage from './components/register';
import LoginPage from './components/login';
import { HomePage } from './components/home';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard, } from './components/User/UserDashboard';
import { checkUser } from './service/ProtectedRoute';
import { useEffect } from 'react';
import { QuizStartPage } from './components/User/QuizStartPage';
import { ProfilePage } from './components/Profile';


function App() {
  const navigate = useNavigate();
  const user = checkUser()
  useEffect(() => {
    if (window.location.pathname !== "/register") {
      if (!user[0]) {
        navigate('/login')
      }
    }
  }, [user])
  

  return (
    <>
      <Routes>
        {user[0]  && <Route path="/home" element={<HomePage />} />}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        {user[0] && user[1]==="ADMIN" && (
          <Route path="/admin/*" element={<AdminDashboard />}>
          {/* <Route path='categories' element={<ViewCategoryPage/>}/>
          <Route path="profile" element={<ProfilePage/>} />
          <Route path='add-category' element={<AddCategoryPage/>}/>
          <Route path='quizzes' element={<AddCategoryPage/>}/> 
          <Route path='add-quiz' element={<AddCategoryPage/>}/> */}
          </Route>
        )}
        {user[0] && user[1]==="NORMAL" && <Route path="/user-dashboard/all/*" element={<UserDashboard />} />}
        {/* {user[0] && user[1]==="NORMAL" && <Route path="/instructions/:qid" element={<QuizInstructionPage/>}/>} */}
        {user[0] && user[1]==="NORMAL" && <Route path="/startQuiz/:qid" element={<QuizStartPage/>}/>}

        {user[0] && <Route path="/profile" element={<ProfilePage/>} />}
      </Routes>
    </>
  );
}

export default App;
