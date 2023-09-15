import './index.css';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from './Context';
import { AllRouters } from './Routes';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
  );

root.render(
    <>
      <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        className: "relative top-[6vh] bg-base-100 text-white",
        duration: 5000
      }}
    />
    <UserContextProvider>
       <AllRouters/>
    </UserContextProvider>
    </>

);


reportWebVitals();
