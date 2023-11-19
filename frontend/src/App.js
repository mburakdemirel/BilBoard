import logo from './logo.svg';
import './App.css';
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProductDetailPage from "./components/ProductDetailPage";
import {Route, Routes} from 'react-router-dom';
import NavigationBarLanding from './components/NavigationBarLanding';
import Footer from './components/Footer';
import NavigationBarDefault from "./components/NavigationBarDefault";
import Profile from "./components/Profile";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import MessagePage from "./components/MessagePage";
import MessagesDeneme from "./components/MessagesDeneme";

// we don't need to add NavigationBar and Footer to each page because they are added here only the Routes part of the app will differ.
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<><NavigationBarLanding/><LoginPage/></>}></Route>
        <Route path='/register' element={<><NavigationBarLanding/><RegisterPage/></>}></Route>
        {/** We will probably add a new component called <ProtectedRoute> or something for pages that should be seen after authentication */}
        <Route path='/' element={<><NavigationBarLanding/><LandingPage/></>}></Route>
          <Route path='/profile' element={<><NavigationBarLanding/><Profile/></>}></Route>
          <Route path='/change_password' element={<><NavigationBarLanding/><ForgotPasswordPage/></>}></Route>

          <Route path='/messages' element={<><NavigationBarLanding/><MessagePage/></>}></Route>
          <Route path='/messages_deneme' element={<><NavigationBarLanding/><MessagesDeneme/></>}></Route>
          <Route path='/product_detail' element={<><NavigationBarLanding/><ProductDetailPage/></>}></Route>
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;

