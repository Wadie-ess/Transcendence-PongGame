import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Login} from './components/Login'
import {Main} from './components/Login/main'
import {Lobby} from './components/Lobby/index'
import {Error} from './components/404/index'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from './components/Home';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/main" element={<Main/>}></Route>
        <Route path="/lobby" element={<Lobby/>}></Route>
        <Route path="/home" element={<Home/>}></Route>
        <Route path="/*" element={<Error/>}></Route>

      </Routes>
    </BrowserRouter>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
