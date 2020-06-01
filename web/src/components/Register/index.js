import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { registerFetch } from '../../store/fetchActions'

import { TextField, Button, FormGroup } from '@material-ui/core';
import InputMask from 'react-input-mask';

import logo from '../../assets/logo.png';
import './styles.css';

export default function Login () {
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    cpf : '',
    address_zipcode: '',
    address_country: 'Brasil'
  })
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
        .execute("6LfG1v0UAAAAAKNCa9ezWdjfpMhRj71UcmSK8OyB", { action: "register" })
        .then(token => {
          setGtoken(token);
        })
    })

    setInterval(function () {
      window.grecaptcha
      .execute("6LfG1v0UAAAAAKNCa9ezWdjfpMhRj71UcmSK8OyB", { action: 'register' })
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
        register();
      }else{
        alert('Falha no Captcha')
      }
    } catch(error) {
        alert('Falha na requisição');
    }
  }

  const register = () => {
    if(user.password.length < 6){
      alert('Senha muito curta \n A senha deverá ser maior que 6 caracteres');
      setUser({...user, password : ''});
    }else{
      user.email = user.email.toLowerCase();
      user.cpf = user.cpf.replace(/[-.]/gi,'');
      user.address_zipcode = user.address_zipcode.replace(/[-]/gi,'');
      dispatch(registerFetch(user));
    }
    
  }
  
  return (
    <div id="register-screen-wrapper" >
      <div className="register-container">
        <img src={logo} alt="logo"/>

        <div className="welcome-container">
          <h4>Criar conta</h4>
          <p>Preencha as informações abaixo para criar sua conta.</p>
        </div>
        <FormGroup style={{width: '100%', padding: '0 20px'}} >
          <div style={{display: 'flex', marginBottom: '5px'}} >
            <TextField 
              id="input-name" 
              label="Nome" 
              type="name"
              variant="outlined"
              size="small"
              style={{marginRight: '5px'}}
              value={user.firstName}
              onChange={(e) => setUser({...user, firstName: e.target.value})}
            />
            <TextField 
              id="input-lastname" 
              label="Sobrenome" 
              variant="outlined"
              size="small"
              type="name"
              value={user.lastName}
              onChange={(e) => setUser({...user, lastName: e.target.value})}
            />
          </div>

          <TextField 
            id="input-email" 
            label="Email" 
            type="email"
            variant="outlined"
            size="small"
            style={{marginBottom: '5px'}}
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value.trim()})}
          />

          <TextField 
            id="input-password" 
            label="Senha (mais de 6 caracteres)" 
            type="password"
            variant="outlined"
            size="small"
            style={{marginBottom: '5px'}}
            value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})}
          />

          <div style={{display: 'flex', marginBottom: '40px'}} >
            <InputMask
              mask="999.999.999-99"
              value={user.cpf}
              onChange={(e) => setUser({...user, cpf: e.target.value})}
            >
            {() => <TextField 
                id="input-cpf"
                label="CPF"
                variant="outlined"
                size="small" 
                value={user.cpf}
                style={{marginBottom: '5px', marginRight: '5px'}}
              />}
            </InputMask>
            <InputMask
                mask="99999-999"
                value={user.address_zipcode}
                onChange={(e) => setUser({...user, address_zipcode: e.target.value})}
              >       
            {() => <TextField 
                id="input-cep"
                label="CEP"
                variant="outlined"
                size="small" 
                style={{marginBottom: '5px'}}
                value={user.address_zipcode}
              />}
            </InputMask>
          </div>
          
          <div className="btn-container">
            <div id="register-container">
              <Link to ="/" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  style={{
                    border: '1px solid #0832a3',
                    background: '#FFF',
                    color: '#0832a3'
                  }}
                >
                  Voltar
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
                Registrar
              </Button>           
            </div>
          </div>
        </FormGroup>
      </div>
    </div>
  );
}