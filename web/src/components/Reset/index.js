import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { resetPasswordFetch } from '../../store/fetchActions'

import { TextField, Button, InputAdornment } from '@material-ui/core';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import logo from '../../assets/logo.png';
import './styles.css';

export default function Login () {
  const dispatch = useDispatch();

  const email = localStorage.getItem('@hope/email');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');

  const resetPassword = () => {
    if(email !== '' && token !== '' && password !== '')
      dispatch(resetPasswordFetch(email, password, token));
  }

  return (
    <div id="reset-screen-wrapper" >
      <div className="reset-container">
        <img src={logo} alt="logo"/>

        <div className="welcome-container">
          <h4>Alterar senha</h4>
          <p>Preencha o formulário abaixo para mudar sua senha.</p>
        </div>
        <form>
          <TextField 
            label="Token"
            variant="outlined"
            size="small"
            type="token"
            style={{
              backgroundColor: '#FFF',
              marginBottom: '20px'
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyOutlinedIcon style={{color: '#e0e0e0' }}/>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setToken(e.target.value)}
          />

          <TextField
            label="Nova senha (mais de 6 caracteres)" 
            variant="outlined"
            size="small"
            type="password"
            style={{
              backgroundColor: '#FFF',
              marginBottom: '40px'
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
          <div className="btn-container">
            <div>
              <Link to ="/forgot" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  style={{
                    border: '1px solid #0832a3',
                    background: '#FFF',
                    color: '#0832a3',
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
                onClick={resetPassword}
              >
                Alterar
              </Button>           
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
  