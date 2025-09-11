import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import JobPortal from './jobs-pages/job_portal'
import JobDetails from './jobs-pages/jobDetails'
import Home from './pages/Home'
import Profile from './pages/Profile'
import ResetPassword from './pages/resetPassword'
import ForgetPassword from './pages/forgetPassword'
import { useEffect } from 'react'
import  {jwtDecode}  from 'jwt-decode'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to='/login' replace />
  }
  return children;
};
function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to='/' replace />
  }
  return children;
};

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decode = jwtDecode(token);

        if (decode.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          alert("Session expired, please login again");
          navigate("/login");
        } else {
          const timeOut = decode.exp * 1000 - Date.now();
          const logoutTimer = setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            alert("Session expired, please login again");
            navigate("/login");
          }, timeOut);
          return () => clearTimeout(logoutTimer);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path='/register' element={ <PublicRoute> <Register /> </PublicRoute> } />
      <Route path='/login' element={<PublicRoute> <Login /> </PublicRoute>} />
      <Route path='/' element={<Home />} />
      <Route path='/forget-password' element={<ForgetPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path='/job_portal' element={<PrivateRoute> <JobPortal /></PrivateRoute>} />
      <Route path='/job_portal/:id' element={<PrivateRoute><JobDetails /></PrivateRoute>} />
    </Routes>
  )
}

  function App() {
    return (
      <BrowserRouter>
       <AppRoutes/>
      </BrowserRouter>
    )
  }

  export default App
