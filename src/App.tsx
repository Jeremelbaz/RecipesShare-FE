import AllPosts from "./components/Post/AllPosts"
import PostForm from "./components/Post/Post-form"
import Registration from "./components/Auth/RegistrationForm"
import Login from "./components/Auth/LoginForn";
import Profile from "./components/Profile/Profile";
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "./navbar";
import "./navBar.css";
import PostDetails from "./components/Post/PostDetails";

function App() {
  return (
    <BrowserRouter>
      <ConditionalNavbar />
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/posts" element={<AllPosts/>} />
        <Route path="/" element={<Login/>} />
        <Route path="/posts/create" element={<PostForm/>}/>
        <Route path='/posts/:postId' element={<PostDetails/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  )
}

const ConditionalNavbar: React.FC = () => {
  const location = useLocation();

  // Hide Navbar only on the /register and sign in pages
  if (location.pathname === "/register" || location.pathname === "/") {
    return null;
  }

  return <Navbar />;
};

export default App