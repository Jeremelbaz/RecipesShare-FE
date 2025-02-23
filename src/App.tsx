import PostList from "./components/Post/Post-list"
import Registration from "./components/Auth/RegistrationForm"

function App() {
  return (
    <div className="container">
      <Registration />
      <PostList />
    </div>
  )
}


export default App