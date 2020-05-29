import React from 'react';
import firebase from '../services/firebase';

export default function Login () {
  const testRef = firebase.database().ref('Batimentos');

  return (
    <div id="login" >
      { testRef.on('value', (snapshot) => {
        console.log(snapshot.val());
      })  }
      <h1>TESTE</h1>
    </div>
    );
}
