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
import ProductMainPage from "./components/ProductMainPage";
import ContextApi from "./context/ContextApi";
import {useState, useEffect} from "react";
import { ProductAddForm } from './components/ProductAddForm';
import { EntryForm } from './components/EntryForm';
import EntryMainPage from "./components/EntryMainPage";

import MainPage from "./components/MainPage";
import ProfileOther from "./components/ProfileOther";
import AboutPage from "./components/AboutPage";

// we don't need to add NavigationBar and Footer to each page because they are added here only the Routes part of the app will differ.
function App() {

    const [type, setType] = useState('');
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');
    const [isProfileChanged, setIsProfileChanged] = useState('');
    const sendMessage = (nMessage) => {
        setMessage(nMessage);

    }
    const changeType = (newType) => {
        setType(newType);
    }

    const changeProductCategory = (newCategory) => {
        setType(newCategory);
    }

    const changeIsProfile = (isChanged) => {
        setIsProfileChanged(isChanged);
    }


    return (
      <ContextApi.Provider value={{isImageViewerOpen: type, changeIsImageViewerOpen:changeType, newMessage: message, sendNewMessage: sendMessage, productCategory:category, changeCategory:changeProductCategory,
                                    isProfileChanged: isProfileChanged, changeProfile:changeIsProfile}}>
          <div className="App">

              <Routes>
                  <Route path='/' element={<><NavigationBarLanding/><LandingPage/></>}></Route>
                  <Route path='/login' element={<><NavigationBarLanding/><LoginPage/></>}></Route>
                  <Route path='/register' element={<><NavigationBarLanding/><RegisterPage/></>}></Route>
                  <Route path='/change_password' element={<><NavigationBarLanding/><ForgotPasswordPage/></>}></Route>
                  <Route path='/about' element={<><NavigationBarLanding/><AboutPage/></>}></Route>
                  {/** We will probably add a new component called <ProtectedRoute> or something for pages that should be seen after authentication */}
                  <Route path='/profile' element={<><NavigationBarDefault/><Profile/></>}></Route>
                  <Route path='/profile/:id' element={<><NavigationBarDefault/><ProfileOther/></>}></Route>
                  <Route path='/messages/:chatId?' element={<><NavigationBarDefault/><MessagePage/></>}></Route>
                  <Route path='/product_detail/:pageType/:id' element={<><NavigationBarDefault/><ProductDetailPage/></>}></Route>

                  <Route path='/main_page/:pageType/:searchText?' element={<><NavigationBarDefault/><MainPage/></>}> </Route>
                  <Route path='/entry' element={<><NavigationBarDefault/><EntryForm/></>}> </Route>
                  <Route path='/complaints' element={<><NavigationBarDefault/> <EntryMainPage/></>}> </Route>

                  <Route path='/add_product' element={<><NavigationBarDefault/><ProductAddForm changeMode={false}/></>}></Route>
                  <Route path='/post_complaint' element={<><NavigationBarDefault/><EntryForm isComplaint={true}></EntryForm></>}></Route>
                  <Route path='/post_l&f' element={<><NavigationBarDefault/><EntryForm isComplaint={false}></EntryForm></>}></Route>
                  <Route path='/update_product/:id' element={<><NavigationBarDefault/><ProductAddForm changeMode={true}/></>}></Route>
              </Routes>

              <Footer></Footer>
          </div>
      </ContextApi.Provider>

  );
}

export default App;

