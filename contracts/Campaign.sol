// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


contract Campaign {
   
    struct Request{
        string descrition;
        uint  value;
        address payable  recepient;
        bool complete;
        uint approvalCount;
        mapping (address => bool) approvals;
    }

    uint public numRequest=0;
    uint public numberOfRequest = 0;
    mapping (uint=> Request) public  requests;
    mapping (address => bool) public approvers;
    uint public approversCount;
    address public manager;
    uint public minimumContribution;


    constructor(uint minimum , address creater) {
        manager = creater;
        minimumContribution = minimum;
    }

    modifier onlyOwner(){
        require(msg.sender == manager);
        _;
    }


    function createStruct(string memory _description, uint _value , address payable  _recepient) public onlyOwner {
        Request storage r =  requests[numRequest++];
        r.descrition = _description;
        r.value= _value;
        r.recepient = _recepient;
        r.complete = false;
        r.approvalCount = 0;
        //r.approvals[msg.sender]= true;
        
        numberOfRequest++;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function approveRequest(uint index) public {
        Request storage r = requests[index];
        require(approvers[msg.sender]);
        require(!r.approvals[msg.sender]);

        r.approvals[msg.sender] = true;
        r.approvalCount++;
    }

    function finalizeRequest(uint index) public payable onlyOwner{
        Request storage r = requests[index];

        require(r.approvalCount > approversCount/2);
        require(!r.complete);

        r.recepient.transfer(r.value);
        r.complete = true;

        
    }
    function getSummery() public view returns(uint,uint,uint,uint,address){
        return(
            minimumContribution,
            address(this).balance,
            numberOfRequest,
            approversCount,
            manager
        );
    }
    function getRequestCount() public view returns(uint){
        return numberOfRequest;
    }

}

contract CampaignFactory {
    address[] public deployedCampaign;

    function creatCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum,msg.sender));
        deployedCampaign.push(newCampaign);
    }
    function getDeployedCampaign() public view returns (address[] memory){
        return deployedCampaign;
    }
}