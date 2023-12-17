
import '../src/components/assets/css/hideScrollBar.css';
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProductDetailPage from "./components/ProductDetailPage";
import {Routes, Route, Router} from 'react-router';
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
import LostFoundPage from "./components/LostFoundPage";
import ProtectedRoutes from './components/ProtectedRoutes';

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
                  
                  <Route path='/profile' element={<ProtectedRoutes><NavigationBarDefault/><Profile/></ProtectedRoutes>}></Route>
                  <Route path='/profile/:id' element={<ProtectedRoutes><NavigationBarDefault/><ProfileOther/></ProtectedRoutes>}></Route>
                  <Route path='/messages/:chatId?' element={<ProtectedRoutes><NavigationBarDefault/><MessagePage/></ProtectedRoutes>}></Route>
                  <Route path='/product_detail/:pageType/:id' element={<ProtectedRoutes><NavigationBarDefault/><ProductDetailPage/></ProtectedRoutes>}></Route>

                  <Route path='/main_page/:pageType/:searchText?' element={<ProtectedRoutes><NavigationBarDefault/><MainPage/></ProtectedRoutes>}> </Route>
                  <Route path='/entry' element={<ProtectedRoutes><NavigationBarDefault/><EntryForm/></ProtectedRoutes>}> </Route>
                  <Route path='/complaints' element={<ProtectedRoutes><NavigationBarDefault/> <LostFoundPage/></ProtectedRoutes>}> </Route>

                  <Route path='/add_product' element={<ProtectedRoutes><NavigationBarDefault/><ProductAddForm changeMode={false}/></ProtectedRoutes>}></Route>
                  <Route path='/post_complaint' element={<ProtectedRoutes><NavigationBarDefault/><EntryForm isComplaint={true}></EntryForm></ProtectedRoutes>}></Route>
                  <Route path='/post_l&f' element={<ProtectedRoutes><NavigationBarDefault/><EntryForm isComplaint={false}></EntryForm></ProtectedRoutes>}></Route>
                  <Route path='/update_product/:id' element={<ProtectedRoutes><NavigationBarDefault/><ProductAddForm changeMode={true}/></ProtectedRoutes>}></Route>
                
              </Routes>

              <Footer></Footer>
          </div>
      </ContextApi.Provider>

  );
}

export default App;

