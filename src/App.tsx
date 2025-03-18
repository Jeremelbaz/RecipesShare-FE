import AllPosts from "./components/Post/AllPosts"
import PostForm from "./components/Post/Post-form"
import Registration from "./components/Auth/RegistrationForm"
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "./navbar";
import "./navBar.css";
import PostDetails from "./components/Post/PostDetails";

//       //<PostList />

function App() {
  return (
    <BrowserRouter>
      <ConditionalNavbar />
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/" element={<AllPosts/>} />
        <Route path="/posts/create" element={<PostForm/>}/>
        <Route path='/posts/:postId' element={<PostDetails/>}/>
      </Routes>
    </BrowserRouter>
  )
}

const ConditionalNavbar: React.FC = () => {
  const location = useLocation();

  // Hide Navbar only on the /register page
  if (location.pathname === "/register") {
    return null;
  }

  return <Navbar />;
};

export default App