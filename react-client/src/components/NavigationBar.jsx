import React from 'react';
import { Button } from 'semantic-ui-react';
import axios from 'axios';

export default function NavigationBar() {
  function handleClick() {
    axios.get('/auth/steam/')
      .then((response) => {
        console.log('(Client) Success: Logon')
      })
      .catch((err)=>{
        console.log('I carapped out');
      })
  }
  return (
    <div>
      <Button 
        content='Steam'
        icon='steam' 
        labelPosition='left'
        href='auth/steam'
      />
    </div>
  );
}