import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import CampaignABI from '../abis/campaign.json'

export default function Request(props) {
    let heading;
    const param = useParams()
    if (props.mode === 'dark') {
        heading = {
            color: 'white'
        }
    }
    const fromEth = (n) => {
        return ethers.utils.formatEther(n)
    }
    const toEther = (n) => {
        return ethers.utils.parseUnits(n.toString(), 'ether')
    }
    const [providers, setProviders] = useState(null)
    const [campaign, setCampaign] = useState(null)
    const [account, setAccount] = useState(null)
    const [request, setRequest] = useState([])
    const [isApprover, setisApprover] = useState(false)
    const [approversCount, setApproversCount] = useState()
    const [isOwner, setIsOwner] = useState(false)
    useEffect(() => {
        loadBlockChainData()
    }, [])

    const loadBlockChainData = async () => {

        let provider = new ethers.providers.Web3Provider(window.ethereum)
        setProviders(provider)
        const signer = provider.getSigner()
        const camp = new ethers.Contract(param.address, CampaignABI, signer)
        setCampaign(camp)
        const ac = (await camp.approversCount()).toString()
        setApproversCount(ac)

        const summery = await camp.getRequestCount()
        let req = []
        for (let a = 0; a < summery.toString(); a++) {
            const r = await camp.requests(a)
            req.push(r)
        }
        // const m = await camp.requests(0)
        // console.log(m.approvals)
        setRequest(req)
        const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
        setAccount(accounts[0])
        setisApprover(await camp.approvers(accounts[0]))
        setIsOwner(ethers.utils.getAddress(accounts[0]) == (await camp.manager()))
        window.ethereum.on('accountsChanged', async () => {
            const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
            setAccount(accounts[0])
            setisApprover(await camp.approvers(accounts[0]))
            setIsOwner(ethers.utils.getAddress(accounts[0]) == (await camp.manager()))
            await loadBlockChainData()
        })
    }

    const setApproval = async (index) => {
        const transaction = await campaign.connect(providers.getSigner()).approveRequest(index)
        await transaction.wait()
        await loadBlockChainData()
    }
    const approveRequest = async (index) => {
        if (isOwner) {
            const transaction = await campaign.connect(providers.getSigner()).finalizeRequest(index)
            await transaction.wait()
            await loadBlockChainData()
        }
    }
    return (
        <>
            <div className='container'>

                <div className="row my-2">
                    <div className="col">
                        <h2 style={heading}>Requests</h2>
                    </div>
                    <div className='list-group col' >
                        <Link  className={`list-group-item list-group-item-action active text-center ${isOwner?'':'disabled '}`} to={`/${param.address}/NewRequest`} >Create New Request</Link>
                    </div>

                </div>
                <table className={`table table-${props.mode} table-striped`} >
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Description</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Recepient</th>
                            <th>Approval</th>
                            <th>Approve</th>
                            <th>Finalize</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            request.map((e, index) => {
                                return <tr key={index} >
                                    <th scope="row">{index}</th>
                                    <td>{e.descrition}</td>
                                    <td>{fromEth(e.value.toString())} Eth</td>
                                    <td>{e.recepient}</td>
                                    <td>{e.approvalCount.toString()} / {approversCount}</td>
                                    <td >
                                        {isApprover?<button type="submit" disabled={e.complete} onClick={() => setApproval(index)} className="btn btn-primary">
                                            Approve</button>:
                                            <Link to={`/${param.address}/Campaign`} className={`btn btn-primary text-${props.mode === 'light' ? 'dark' : 'light'}`} role='tab'>
                                            Contribute
                                            </Link>
                                        }
                                    </td>
                                    <td>
                                        {isOwner ? <button type="submit" onClick={() => approveRequest(index)} disabled={(!(e.approvalCount > approversCount / 2))|| e.complete } className="btn btn-primary">
                                            Finalize</button> : <span>Only Owner</span>}
                                    </td>
                                    <td>
                                        {!(e.approvalCount > approversCount / 2) && !e.complete&&<h1 style={{ color: 'red' }}><i className="bi bi-x-lg"></i></h1>}
                                        {e.approvalCount > approversCount / 2 && !e.complete&&<h1 style={{color:'blue'}}><i className="bi bi-check2"></i></h1>}
                                        {e.approvalCount > approversCount / 2 && e.complete&&<h1 style={{color:'green'}}><i class="bi bi-check2-all"></i></h1>}
                                    </td>
                                </tr>
                            })}

                    </tbody>
                </table>
                <div className='list-group col' >
                        <Link  className={`list-group-item list-group-item-action active text-center `} to={`/${param.address}/Campaign`} >Campaign Detail</Link>
                </div>
            </div>
        </>
    )
}
