const { expect } = require('chai')

const token = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}
const toWei = (n) => {
    return ethers.utils.parseEther(n.toString())
}
const fromWei = (n) => {
    return ethers.utils.formatEther(n)
}
describe('Create New Campain', () => {
    let add1, add2, add3, campaign, campaignFactory

    beforeEach(async () => {
        [add1, add2, add3] = await ethers.getSigners()
        // const CampaignFactory = await ethers.getContractFactory('CampaignFactory')
        // campaignFactory = await CampaignFactory.deploy()        
        console.log(add1)
        const Campaign = await ethers.getContractFactory('Campaign')
        campaign = await Campaign.deploy(toWei(10),add1)
        
    })
    
    describe('Test Campaign', () => {
        it('Create Campaign', async () => {
            const manager = await campaign.manager()
            const minContribution = await campaign.minimumContribution()
            expect(manager).to.be.equal(add1)
            console.log(minContribution.toString())
        })
    })
})
