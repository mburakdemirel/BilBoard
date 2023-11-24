import logo from './logo.svg';
import './App.css';
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProductDetailPage from "./components/ProductDetailPage";
import {Routes, Route} from 'react-router';
import NavigationBarLanding from './components/NavigationBarLanding';
import Footer from './components/Footer';
import NavigationBarDefault from "./components/NavigationBarDefault";
import Profile from "./components/Profile";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import MessagePage from "./components/MessagePage";
import MessagesDeneme from "./components/MessagesDeneme";
import MainPage from "./components/MainPage";
import ContextApi from "./context/ContextApi";
import {useState, useEffect} from "react";
import { ProductAddForm } from './components/ProductAddForm';
import { EntryForm } from './components/EntryForm';
import ComplaintsPage from "./components/ComplaintsPage";

// we don't need to add NavigationBar and Footer to each page because they are added here only the Routes part of the app will differ.
function App() {

    const [type, setType] = useState('');
    const [message, setMessage] = useState('');
    const sendMessage = (nMessage) => {
        setMessage(nMessage);

    }
    const changeType = (newType) => {
        setType(newType);
    }

    return (
      <ContextApi.Provider value={{pageType: type, changePageType:changeType, newMessage: message, sendNewMessage: sendMessage, }}>
          <div className="App">

              <Routes>
                  <Route path='/' element={<><NavigationBarLanding/><LandingPage/></>}></Route>
                  <Route path='/login' element={<><NavigationBarLanding/><LoginPage/></>}></Route>
                  <Route path='/register' element={<><NavigationBarLanding/><RegisterPage/></>}></Route>
                  <Route path='/change_password' element={<><NavigationBarLanding/><ForgotPasswordPage/></>}></Route>
                  {/** We will probably add a new component called <ProtectedRoute> or something for pages that should be seen after authentication */}
                  <Route path='/profile' element={<><NavigationBarDefault/><Profile/></>}></Route>
                  <Route path='/messages' element={<><NavigationBarDefault/><MessagePage/></>}></Route>
                  <Route path='/messages_deneme' element={<><NavigationBarDefault/><MessagesDeneme/></>}></Route>
                  <Route path='/product_detail/:id' element={<><NavigationBarDefault/><ProductDetailPage/></>}></Route>
                  <Route path='/main_page' element={<><NavigationBarDefault/><MainPage/></>}> </Route>
                  <Route path='/entry' element={<><NavigationBarDefault/><EntryForm/></>}> </Route>
                  <Route path='/complaints' element={<><NavigationBarDefault/><ComplaintsPage/></>}> </Route>
              </Routes>

              <Footer></Footer>
          </div>
      </ContextApi.Provider>

  );
}

export default App;

