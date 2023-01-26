import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom';
import CampaignABI from '../abis/campaign.json'

export default function Campaign(props) {
    
    let param = useParams()
    let darkDisplay;
    let darkDisplay2;
    if (props.mode === 'dark') {
        darkDisplay = {
            backgroundColor: '#2C3E50',
            color: 'white'
        }
        darkDisplay2 = {
            backgroundColor: '#717D7E',
            color: 'white'
        }
    }
    const [account, setAccount] = useState(null)
    const [manager, setManager] = useState(null)
    const [minimumContribution, setMinimumContribution] = useState(null)
    const [numberOfRequest, setNumberOfRequest] = useState(null)
    const [approversCount, setApproversCount] = useState(null)
    const [balance, setBalance] = useState(null)
    const [providers, setProviders] = useState(null)
    const [campaign, setCampaign] = useState(null)
    const [contributionCost, setContributionCost] = useState()
    const [contributionError, setcontributionError] = useState(false)
    useEffect(() => {
        loadBlockChainData()
    }, [])
    const fromEth = (n) => {
        return ethers.utils.formatEther(n)
    }
    const toEther = (n) => {
        return ethers.utils.parseUnits(n.toString(), 'ether')
    }
    const loadBlockChainData = async () => {

        let provider = new ethers.providers.Web3Provider(window.ethereum)
        setProviders(provider)
        const signer = provider.getSigner()
        const camp = new ethers.Contract(param.address, CampaignABI, signer)
        setCampaign(camp)
        const summery = await camp.getSummery()
        setMinimumContribution(fromEth(summery[0].toString()))
        setBalance(fromEth(summery[1].toString()))
        setNumberOfRequest(summery[2].toString())
        setApproversCount(summery[3].toString())
        setManager(summery[4])

        const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
        setAccount(accounts[0])
        window.ethereum.on('accountsChanged', async () => {
            const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
            setAccount(accounts[0])
            await loadBlockChainData()
        })
    }
    const addContribution = async () => {
        if (contributionCost >= minimumContribution) {
            setcontributionError(false)
            const c = await campaign.connect(providers.getSigner()).contribute({ value: toEther(2.5) })
            await c.wait()
            props.showAlert('Contribution added','success')
            setContributionCost(null)
            await loadBlockChainData()
        } else {
            props.showAlert('Please add minimum Contribution amount','warning')
            setcontributionError(true)
        }
    }
    const onhandlechange = (e) => {
        if (e.target.name == 'cValue') {
            setContributionCost(e.target.value)
        }
    }
    return (
        <div className='container my-1'>
            <div className="row">
                <div className="col-sm-4">
                    <div className="card">
                        <h5 style={darkDisplay} className="card-header">{manager}</h5>
                        <div className="card-body" style={darkDisplay2}>
                            <h5 className="card-title">Address of Manager</h5>
                            <p className="card-text">The manager created this campaign and can create requests to withdraw money</p>
                            {/* <a href="/" className="btn btn-primary">Go somewhere</a> */}
                        </div>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="card">
                        <h5 style={darkDisplay} className="card-header">{minimumContribution}</h5>
                        <div style={darkDisplay2} className="card-body">
                            <h5 className="card-title">Minimum Contribution (Eth)</h5>
                            <p className="card-text">You must contribute at least this much wei to become an approver.</p>
                            {/* <a href="/" className="btn btn-primary">Go somewhere</a> */}
                        </div>
                    </div>
                </div>
                <div className="col-sm-4 ">

                    <div className="input-group mb-3">
                        <input onChange={onhandlechange}  type="text" name='cValue' className="form-control" placeholder="Contribution Amount" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                        <div className="input-group-append">
                            <span className="input-group-text" id="basic-addon2">Ether</span>
                        </div>
                    </div>
                    <div className='card'>
                        <button type='submit' onClick={()=>{addContribution()}} className="btn btn-primary">Contribute</button>
                    </div>
                    {contributionError&&<div class="alert mt-1 alert-warning" role="alert">
                        Please Enter Minimum {minimumContribution} Ether
                    </div>}
                </div>
            </div>
            <div className="row mt-3 ">
                <div className="col-sm-4">
                    <div className="card">
                        <h5 style={darkDisplay} className="card-header">{numberOfRequest}</h5>
                        <div className="card-body" style={darkDisplay2}>
                            <h5 className="card-title">Number of Requests</h5>
                            <p className="card-text">A request tries to withdraw money from the contract. Requests must be approved by approvers</p>
                            {/* <a href="/" className="btn btn-primary">Go somewhere</a> */}
                        </div>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="card">
                        <h5 style={darkDisplay} className="card-header">{approversCount}</h5>
                        <div style={darkDisplay2} className="card-body">
                            <h5 className="card-title">Number of Approvers</h5>
                            <p className="card-text">Number of people who have already donated to this campaign.</p>
                            {/* <a href="/" className="btn btn-primary">Go somewhere</a> */}
                        </div>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className='card'>
                        <Link to={`/Request/${param.address}`} className="btn btn-info">View Requests</Link>
                    </div>
                </div>
            </div>
            <div className="row mt-3 ">
                <div className="col-sm-4">
                    <div className="card">
                        <h5 style={darkDisplay} className="card-header">{balance}</h5>
                        <div className="card-body" style={darkDisplay2}>
                            <h5 className="card-title">Campaign Balance (ether)</h5>
                            <p className="card-text">The balance is how much money this campaign has left to spend.</p>
                            {/* <a href="/" className="btn btn-primary">Go somewhere</a> */}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
