import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Login} from './Auth'
import {Main} from './Auth/main'
import {Lobby} from './Lobby/index'
import {Layout} from './Layout/index'

import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/main" element={<Main/>}></Route>
        <Route path="/lobby" element={<Lobby/>}></Route>
        <Route path="/layout" element={<Layout/>}></Route>
      </Routes>
    </BrowserRouter>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
