


import './index.css';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { Toaster } from 'react-hot-toast';
import { AllRouters } from './Routes';

console.log = () => {}
console.error = () => {}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
  );

root.render(
    <>
      <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        style:{
          background:"#7247c8",
          color:"white",
        },
        className: "relative top-[6vh] bg-base-100 text-white",
        duration: 3000
      }}
    />
       <AllRouters/>
    </>

);


reportWebVitals();
