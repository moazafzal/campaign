import { ethers } from 'ethers';
import React, {  useState } from 'react'

export default function NewCampaign(props) {
    let inputMode;
    let heading;
    let bgColor;
    if (props.mode === 'dark') {
        inputMode = ' bg-dark text-white ';
        heading = 'text-white';
        bgColor = {
            backgroundColor: '#2C3E50'
        }
    }
    const [cost, setCost] = useState(null)
    
    const onHandleChange = (e)=>{
        if(e.target.name==='minCost'){
            setCost(tokens(e.target.value))
        }
    }
    const tokens = (n) => {
        return ethers.utils.parseUnits(n.toString(), 'ether')
    }
    return (
        <div className='container my-1'>
            
                <h3 className={`my-3 ${heading}`}>Create New Campaign</h3>
                <div className="input-group mb-3">
                    `<div className="input-group-prepend">
                        <span className={`input-group-text rounded-0 ${heading}`} style={bgColor}>Minimum Contibution</span>
                    </div>
                    <input onChange={onHandleChange} type="text" name='minCost' className={`form-control ${inputMode}`} aria-label="Amount (to the nearest dollar)" />
                    <div className="input-group-append">
                        <span className={`input-group-text rounded-0 ${heading}`} style={bgColor}>Wei</span>
                    </div>
                </div>
                <button type="submit" onClick={()=>{props.addCampaign(cost)}} className="my-2 btn btn-primary">Submit</button>
            
        </div>
    );
}
