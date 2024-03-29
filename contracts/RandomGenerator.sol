// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import {GovernanceInterface} from "./interfaces/GovernanceInterface.sol";
import {DuelInterface} from "./interfaces/DuelInterface.sol";

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

contract RandomNumberGenerator is VRFConsumerBaseV2 {
    bytes32 internal keyhash;
    mapping(uint256 => bytes32) public requestIds;
    uint256 public mostRecentRandomness;
    address owner;
    address contractOwner;

    VRFCoordinatorV2Interface COORDINATOR;
    LinkTokenInterface LINKTOKEN;
    GovernanceInterface public governance;

    uint64 subscriptionId;
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;

    event RequestedRandomness(uint256 requestId);
    event FulfilledRandomness(bytes32 roomId, uint256 randomness);
    event TransferOwnership(address newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can call it");
        _;
    }

    modifier onlyContractOwner() {
        require(msg.sender == contractOwner, "only contract owner can call it");
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        contractOwner = newOwner;

        emit TransferOwnership(newOwner);
    }

    // TODO: LINKTOKEN might not be needed, delete later
    constructor(
        address _vrfCoordinator,
        address _link,
        bytes32 _keyhash,
        address _governance,
        uint64 _subscriptionId
    ) VRFConsumerBaseV2(_vrfCoordinator) {
        keyhash = _keyhash;
        governance = GovernanceInterface(_governance);
        subscriptionId = _subscriptionId;
        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
        LINKTOKEN = LinkTokenInterface(_link);
        owner = msg.sender;
    }

    /**
     *	Requests randomness to VRFCoordinator
     */
    function getRandom(bytes32 _roomId) external onlyContractOwner {
        require(keyhash != bytes32(0), "Must have a valid keyhash!");

        // TODO: function can revert, make an error catching function
        uint256 _requestId = COORDINATOR.requestRandomWords(
            keyhash,
            subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );

        requestIds[_requestId] = _roomId;

        emit RequestedRandomness(_requestId);
    }

    /**
     * Required to override to request randomness from VRFCoordinator
     */
    function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomnessArr)
    internal
    override
    {
        // we only get 1 value so just get the first element
        uint256 _randomness = _randomnessArr[0];
        require(_randomness > 0, "random not found");

        mostRecentRandomness = _randomness;

        bytes32 roomId = requestIds[_requestId];

        emit FulfilledRandomness(roomId, _randomness);
        DuelInterface(governance.duel()).endDuel(roomId, _randomness);
    }

    function addConsumer(address consumerAddress) external onlyOwner {
        // Add a consumer contract to the subscription.
        COORDINATOR.addConsumer(subscriptionId, consumerAddress);
    }
}
