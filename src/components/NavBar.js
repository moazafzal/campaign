import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBar(props) {
  
  return (
    
        <nav className={`navbar navbar-${props.mode} navbar-expand-lg bg-${props.mode}`}>
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Campaign Test</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav" >
                    <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                    <Link className="nav-link" to="/NewCampaign">Add New Campaign</Link>
                    
                </div>
                
                {props.account?<div className={`text-${props.mode==='light'?'dark':'light'}`}>{props.account.slice(0,6)}....{props.account.slice(37,41)}</div>
                :<button onClick={()=>{props.loadBlockChainData()}}>Connect Wallet</button>}
                </div>
              <div className="form-check form-switch">
                <input className="form-check-input"  type="checkbox" onClick={props.toggleMode} role="switch" id="flexSwitchCheckDefault"/>
                <label className={`form-check-label text-${props.mode==='light'?'dark':'light'}`}   htmlFor="flexSwitchCheckDefault">Enable Dark Mode</label>
            </div>
            </div>
            
        </nav>
    
  )
}
