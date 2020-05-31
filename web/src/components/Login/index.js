import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { authFetch } from '../../store/fetchActions'
import firebase from '../../services/firebase';

import { TextField, Button } from '@material-ui/core';
import logo from '../../assets/logo.png';
import './styles.css';

export default function Login () {
  const dataRef = firebase.database().ref('Batimentos');

  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = () => {
    if(email !== '' && password !== '')
      dispatch(authFetch(email, password));
  }

  return (
    <div id="login-screen-wrapper" >
      { /* dataRef.on('value', (snapshot) => {
        console.log(snapshot.val());
      })  */}
      <div className="login-container">
        <img src={logo} alt="logo"/>
        <form>
          <TextField 
            label="Email"
            type="email"
            style={{
              marginBottom: '20px'
            }}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <TextField
            label="Senha" 
            type="password"
            style={{
              marginBottom: '40px'
            }}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button 
            variant="contained" 
            color="primary"
            onClick={signIn}
          >
            Entrar
          </Button>

          <a
            href="#"
            className="forgot-password"
          >
            Esqueceu sua senha?
          </a>
        </form>
      </div>
    </div>
    );
  }
  