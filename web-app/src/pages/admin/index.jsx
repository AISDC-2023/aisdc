import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Usertable from './usertable';
import Prizetable from './prizetable';


const admin = () => {
  return (
    <>
      <Usertable />
      <Prizetable />
    </>
  );
}


export default admin