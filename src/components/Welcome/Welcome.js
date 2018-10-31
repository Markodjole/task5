import React, { Component } from 'react';
import {Route, Link} from 'react-router-dom';
import './Welcome.css';
import CryptoJS from 'crypto-js';


const Welcome = () => {

   const setAdmin = () => {
    if(!localStorage.getItem('admin@admin.com')){
        let data = CryptoJS.AES.encrypt('{"email":{"value": "admin@admin.com"},"username":{"value": "admin"}, "password": {"value":"admin"}}', 'admin').toString();
    localStorage.setItem('admin@admin.com', data);
       }
    }
    setAdmin();
    return (
        <div className='container'>


            <div className='welcome'>
                <h3>Welcome to react task 5</h3>
                <div>
                    <button ><Link style={{'textDecoration': 'none'}} to='/register'>Register</Link></button>
                    <button ><Link style={{'textDecoration': 'none'}} to='/login'>Login</Link></button>
                </div>


            </div>
        </div>
    );
}

export default Welcome;
