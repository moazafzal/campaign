import React from 'react'
import { Link } from 'react-router-dom'

export default function CampaignsList(props) {
  
  return (
    <div className={`container my-1 text-${props.mode === 'light' ? 'dark' : 'light'}`}>
      <h3>Campaigns List</h3>
      {
        props.campaignList!=null && props.campaignList.map((e,index)=>{
        
        return<div key={index} className={`card my-2 mx-3 `} style={{ width: '30rem',float:'left' }}>
          <div className={`card-body bg-${props.mode}`}>
            <h5 className="card-title">{props.header}</h5>
            {/* <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
            <p className="card-text">{e}</p>
            <Link to={`/${e}/Campaign`} className={`btn btn-primary text-${props.mode === 'light' ? 'dark' : 'light'}`} role='tab'>
              View Campaign
              </Link>

          </div>
        </div>
        })
      }
      
    </div>
  )
}

