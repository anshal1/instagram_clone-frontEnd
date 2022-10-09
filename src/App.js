import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom"
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Loadingbar from './components/Loadingbar';
import State from './context/Mystate';
import Profile from './components/Profile';
import Messages from './components/Messages';
import SProfile from './components/Sprofile';
import Upload from './components/Upload';
import Alert from './components/Alert';
import Edit from './components/Edit';
import Progressbar from './components/Progressbar';
import Profilepost from "./components/Profilepost"
import Commentmodal from './components/Commentmodal';
import Commentpage from './components/Commentpage';
import Chat from './components/Chat';
import Chatpage from './components/Chatpage';
import Pageloader from './components/Pageloader';
import PageNotFound from './components/PageNotFound';
function App() {
  return (
    <>
      <State>
        <Router>
          <Loadingbar />
          <Navbar />
          <Alert />
          <Progressbar />
          <Commentmodal />
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/' element={<Home />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/message' element={<Messages />} />
            <Route path='/user/profile' element={<SProfile />} />
            <Route path='/upload' element={<Upload />} />
            <Route path='/edit' element={<Edit />} />
            <Route path='/post' element={<Profilepost />} />
            <Route path='/comment' element={<Commentpage />}/>
            <Route path='/chat' element={<Chat />} />
            <Route path='/user/chat' element={<Chatpage/>} />
            <Route path='/loader' element={<Pageloader />} />
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </Router>
      </State>
    </>
  );
}

export default App;
