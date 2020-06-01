import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { forgotPasswordFetch } from '../../store/fetchActions'

import { TextField, Button, InputAdornment } from '@material-ui/core';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';

import logo from '../../assets/logo.png';
import './styles.css';

export default function Login () {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');

  const forgotPassword = () => {
    console.log(email);
    if(email !== '')
      dispatch(forgotPasswordFetch(email));
  }

  return (
    <div id="forgot-screen-wrapper" >
      <div className="forgot-container">
        <img src={logo} alt="logo"/>

        <div className="welcome-container">
          <h4>Esqueceu sua senha?</h4>
          <p>Preencha o formulário abaixo para mudar sua senha.</p>
        </div>
        <form>
          <TextField 
            label="Email"
            variant="outlined"
            size="small"
            type="email"
            style={{
              backgroundColor: '#FFF',
              marginBottom: '40px'
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

          <div className="btn-container">
            <div>
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
                onClick={forgotPassword}
              >
                Enviar
              </Button>           
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
  