import PostList from "./components/Post/Post-list"
import PostForm from "./components/Post/Post-form"
import Registration from "./components/Auth/RegistrationForm"
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//       //<PostList />

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/" element={<PostList/>} />
        <Route path="/posts/create" element={<PostForm/>}/>
      </Routes>
    </BrowserRouter>
  )
}


export default App