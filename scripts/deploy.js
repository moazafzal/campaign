// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}
async function main() {
    
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    // const[deployer] = await ethers.getSigners()

    //Deploy Contract
    // const Campaign = await ethers.getContractFactory("Campaign");
    const CampaignFactory = await ethers.getContractFactory("CampaignFactory");
    // deploy contracts
    const campaignFactory = await CampaignFactory.deploy();
    await campaignFactory.deployed()
    // const campaign = await Campaign.deploy();
    console.log(`Deployed CampaignFactory Contract at: ${campaignFactory.address}\n`)
    // console.log(`Deployed Campaign Contract at: ${campaign.address}\n`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
