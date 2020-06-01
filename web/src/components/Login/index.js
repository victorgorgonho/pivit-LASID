import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import firebase from '../../services/firebase';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { authFetch } from '../../store/fetchActions'

import { TextField, Button, InputAdornment } from '@material-ui/core';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import logo from '../../assets/logo.png';
import './styles.css';

export default function Login () {
  const dataRef = firebase.database().ref('Batimentos');
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gtoken, setGtoken] = useState('');
  
  const MIN_SCORE = 0.6;

  useEffect(() => {
    localStorage.removeItem('@lasid/token');
    
    // Add reCaptcha
    const script = document.createElement("script")
    script.src = "https://www.google.com/recaptcha/api.js?render=6LfG1v0UAAAAAKNCa9ezWdjfpMhRj71UcmSK8OyB"
    script.addEventListener("load", handleLoaded)
    document.body.appendChild(script)
  }, []);

  const handleLoaded = () => {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute("6LfG1v0UAAAAAKNCa9ezWdjfpMhRj71UcmSK8OyB", { action: "login" })
        .then(token => {
          setGtoken(token);
        })
    })

    setInterval(function () {
      window.grecaptcha
      .execute("6LfG1v0UAAAAAKNCa9ezWdjfpMhRj71UcmSK8OyB", { action: 'login' })
      .then(token => {
        setGtoken(token);
      })
    }, 120000);
  }

  const handleSubmit = async () => {
    
    try{    
      handleLoaded();

      const obj = {token : gtoken};

      const response = await api.post(
        `/captcha/send`, obj,
      );
      const score = response.data.google_response.score;
      console.log(response.data.google_response);
      
      if(score >= MIN_SCORE){
        signIn();
      }else{
        alert('Falha no Captcha')
      }
    } catch(error) {
        alert('Falha na requisição');
    }
  }

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

        <div className="welcome-container">
          <h4>Login</h4>
          <p>Bem-vindo! Faça login para acessar sua conta.</p>
        </div>
        <form>
          <TextField 
            label="Email"
            variant="outlined"
            size="small"
            type="email"
            style={{
              backgroundColor: '#FFF',
              marginBottom: '20px'
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon style={{color: '#e0e0e0' }}/>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <TextField
            label="Senha" 
            variant="outlined"
            size="small"
            type="password"
            style={{
              backgroundColor: '#FFF',
              marginBottom: '16px'
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon style={{color: '#e0e0e0' }}/>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <div style={{ display: 'flex', flexDirection: 'row-reverse'}}>
            <a href="/forgot" style={{color: '#0832a3', opacity: 0.8}}>
              Esqueceu sua senha?
            </a>
          </div>
          
          <div className="btn-container">
            <div id="register-container">
              <Link to ="/register" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  style={{
                    border: '1px solid #0832a3',
                    background: '#FFF',
                    color: '#0832a3'
                  }}
                >
                  Registrar
                </Button>
              </Link>
            </div>
            
            <div id="login-container">
              <Button 
                variant="contained" 
                color="primary"
                style={{
                  border: '1px solid #0832a3',
                  background: '#0832a3',
                  color: '#FFF'
                }}
                onClick={handleSubmit}
              >
                Entrar
              </Button>           
            </div>
          </div>
        </form>
      </div>
      <div
        className="g-recaptcha"
        data-sitekey="6Ld5zPsUAAAAAKq-dwn9hVqBYJjRCmAMsoqBsq8Z"
        data-size="invisible"
      ></div>
    </div>
  );
}
  