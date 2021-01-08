import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RecoilRoot } from 'recoil';
import firebase from 'firebase'
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBUAQD9nlKAJTbdBEUgOx6h8qmsWRBH_sQ",
    authDomain: "chair-picker.firebaseapp.com",
    projectId: "chair-picker",
    storageBucket: "chair-picker.appspot.com",
    messagingSenderId: "1035876189218",
    appId: "1:1035876189218:web:aa3e1b9d40fc1daf2cb67b",
    measurementId: "G-1HP1P0266H"
};

firebase.initializeApp(firebaseConfig)
  

ReactDOM.render(
    <React.StrictMode>
        <RecoilRoot>
            <App/>
        </RecoilRoot>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
