import { useEffect, useState } from "react";
import "./App.css";
import Alerts from "./components/Alerts";
import CampaignsList from "./components/CampaignsList";
import NavBar from "./components/NavBar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Campaign from "./components/Campaign";
import Request from "./components/Request";
import NewCampaign from "./components/NewCampaign";
import NewRequest from "./components/NewRequest";
import { ethers } from "ethers";
import CampaignFactoryABI from './abis/campaignFactory.json'
import CampaignABI from './abis/campaign.json'
import config from './config.json'
function App() {

  const [mode, newMode] = useState('light');
  const [alert, setAlert] = useState('null');
  const [campaignFactory, setCampaignFactory] = useState()
  const [providers, setProviders] = useState(null)
  const [account, setAccount] = useState(null)
  const [campaigns, setCampaigns] = useState(null)


  const showAlert = (message, type) => {
    setAlert({ message: message, type: type });
    setTimeout(() => {
      setAlert('null');
    }, 2000);
  }
  const toggleMode = () => {
    if (mode === 'dark') {
      newMode('light');
      document.body.style.backgroundColor = 'white';
      showAlert('Light Mode Enabled', 'Success');
    } else {
      newMode('dark');
      document.body.style.backgroundColor = '#6B8499';
      showAlert('Dark Mode Enabled', 'Success');
    }
  }
  useEffect(() => {
    loadBlockChainData()
  }, [])
  const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
  }


  const loadBlockChainData = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProviders(provider)

    const network = await provider.getNetwork()
    const signer = provider.getSigner()

    const campfactory = new ethers.Contract(config[network.chainId].CampaignFactory.address, CampaignFactoryABI, signer)
    setCampaignFactory(campfactory)

    const Campaign = await campfactory.getDeployedCampaign()
    setCampaigns(Campaign)

    const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
    setAccount(accounts[0])
    
    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
      await loadBlockChainData()
    })
  }

  const addCampaign = async (cost) => {
    const createCampaign = await campaignFactory.connect(providers.getSigner()).creatCampaign(cost)
    await createCampaign.wait()
    showAlert('New Campaign added', 'Success');
    await loadBlockChainData()
  }

  return (
    <>
      <Router>
        <NavBar mode={mode} loadBlockChainData={loadBlockChainData} account={account} toggleMode={toggleMode} />

        <Alerts alert={alert} />
        <Routes>
          <Route path='/' element={<CampaignsList header='Address' campaignList={campaigns} mode={mode} />}></Route>
          <Route path="/:address/Campaign" element={<Campaign mode={mode} showAlert={showAlert} />}></Route>
          <Route path="/Request/:address" element={<Request mode={mode} />}></Route>
          <Route path="/NewCampaign" element={<NewCampaign addCampaign={addCampaign} mode={mode} />}>
          </Route>
          <Route path="/:address/NewRequest" element={<NewRequest showAlert={showAlert} mode={mode} />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
