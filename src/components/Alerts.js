import React from 'react'

export default function Alerts(props) {
    
  return (
    <div>
     <div  className={`alert py-1 mb-0 alert-primary alert-dismissible ${props.alert==='null'?' fade':' show'}`} >
    <strong>{props.alert.type} : </strong> {props.alert.message}
  </div>
    </div>
  );
}
