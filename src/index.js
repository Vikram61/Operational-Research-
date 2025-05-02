import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Navbar from './components/Navbar';
import LPP from './components/LPP';
import About from './components/About';
import JobSeq from './components/JobSeq';
import BigMSolver from './components/BigMSolver';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
const router= createBrowserRouter([
  {
    path:'/',
    element:<App/>,
  },

  {
    path:'navbar',
    element:<Navbar/>,
  },
  {
    path:'lpp',
    element:<LPP/>
  },
  {
    path:'about',
    element:<About/>
  },
  {
    path:'job',
    element:<JobSeq/>
  },
  {
    path:'bigm',
    element:<BigMSolver/>
  }

]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

