import React from 'react';
import  { Toaster } from 'react-hot-toast';
import { UserContextProvider } from './Context';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Login} from './components/Login'
import {Main} from './components/Login/main'
import {Lobby} from './components/Lobby/index'
import {Error} from './components/404/index'
import {Profile} from './components/Profile'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from './components/Home';
import { Play } from './components/Play';
import { Setting } from './components/Settings';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        className: "relative top-[6vh] bg-base-100 text-white",
        duration: 5000
      }}
    />
    
    <BrowserRouter>
      <UserContextProvider>
        <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/main" element={<Main/>}></Route>
            <Route path="/lobby" element={<Lobby/>}></Route>
            <Route path="/home" element={<Home/>}></Route>
            <Route path="/profile" element={<Profile/>}></Route>
            <Route path="/play" element={<Play/>}></Route>
            <Route path="/Settings" element={<Setting/>}></Route>
            <Route path="/*" element={<Error/>}></Route>
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
