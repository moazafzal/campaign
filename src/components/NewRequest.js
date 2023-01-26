import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom'
import CampaignABI from '../abis/campaign.json'

const NewRequest = (props) => {
  const [description, setDescription] = useState(null)
  const [amount, setAmount] = useState(null)
  const [receipent, setReceipent] = useState(null)
  const [campaign, setCampaign] = useState(null)
  const [signer, setSigner] = useState(null)
  const [balance, setBalance] = useState()
  const param = useParams()
  const nav = useNavigate()

  const fromEth = (n) => {
    return ethers.utils.formatEther(n)
  }
  const toEther = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
  }

  const handelChange = (e) => {
    if (e.target.name == 'description') {
      setDescription(e.target.value)
    }
    if (e.target.name == 'amount') {
      setAmount(toEther(e.target.value))
    }
    if (e.target.name == 'receipent') {
      setReceipent(e.target.value)
    }

  }
  useEffect(() => {
    blockChainData()
  }, [])
  const blockChainData = async () => {
    let provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const camp = new ethers.Contract(param.address, CampaignABI, signer)
    const s = await camp.getSummery()
    setBalance(fromEth(s[1].toString()))
    setCampaign(camp)
    setSigner(signer)
    window.ethereum.on('accountsChanged', async () => {
      await blockChainData()
    })
  }
  const handleSubmit = async () => {
    const transaction = await campaign.connect(signer).createStruct(description, amount, receipent)
    await transaction.wait()
    props.showAlert('Your Request successfully submited', 'success')
    nav(`/Request/${param.address}`)
  }
  return (
    <div className='container'>
      <div className='float-right mx-auto'>
        <Link to={`/Request/${param.address}`} className=" my-2 btn btn-primary">All Request</Link>
      </div>

      <div className="form-group my-2">
        <label htmlFor="exampleInputEmail1">Description</label>
        <input type="text" onChange={handelChange} name='description' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Description" />
      </div>
      <div className="form-group my-2">
        <label htmlFor="exampleInputPassword1">Amount </label>
        <input type="number" onChange={handelChange} name='amount' max={balance} className="form-control" id="exampleInputPassword1" placeholder="Amount(Eth)" />
        <small id="emailHelp" className="form-text text-muted">Your Campaign Maximum Balance in {balance}Eth</small>
      </div>

      <div className="form-group my-3">
        <label htmlFor="exampleInputEmail1">Receipent address</label>
        <input type="text" onChange={handelChange} name='receipent' className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Recepient Address" />
      </div>
      <button onClick={handleSubmit} type="submit" className=" my-2 btn btn-primary">Submit Request</button>

    </div>
  )
}

export default NewRequest
