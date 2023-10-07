import logo from './logo.svg';
import './App.css';
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProductDetailPage from "./components/ProductDetailPage";
import {Route, Routes} from 'react-router-dom';
import NavigationBarLanding from './components/NavigationBarLanding';
import Footer from './components/Footer';

// we don't need to add NavigationBar and Footer to each page because they are added here only the Routes part of the app will differ.
function App() {
  return (
    <div className="App">
      <NavigationBarLanding></NavigationBarLanding>
      <Routes>
        <Route path='/login' element={<LoginPage></LoginPage>}></Route>
        <Route path='/register' element={<RegisterPage></RegisterPage>}></Route>
        {/** We will probably add a new component called <ProtectedRoute> or something for pages that should be seen after authentication */}
        <Route path='/' element={<LandingPage></LandingPage>}></Route>
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;

