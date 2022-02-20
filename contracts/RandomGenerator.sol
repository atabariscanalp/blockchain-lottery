// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

import {GovernanceInterface} from "./interfaces/GovernanceInterface.sol";
import {DuelloInterface} from "./interfaces/DuelloInterface.sol";

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract RandomNumberGenerator is VRFConsumerBase {
    bytes32 internal keyhash;
    uint256 internal fee;
    mapping(bytes32 => bytes32) public requestIds;
    uint256 public mostRecentRandomness;

    GovernanceInterface public governance;

    event RequestedRandomness(bytes32 requestId);
    event FulfilledRandomness(bytes32 roomId, uint256 randomness);

    constructor(
        address _vrfCoordinator,
        address _link,
        bytes32 _keyhash,
        address _governance
    ) VRFConsumerBase(_vrfCoordinator, _link) {
        fee = 0.1 * 10**18;
        keyhash = _keyhash;
        governance = GovernanceInterface(_governance);
    }

    /**
     *	Requests randomness to VRFCoordinator
     */
    function getRandom(bytes32 _roomId) external {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        require(keyhash != bytes32(0), "Must have a valid keyhash!");

        bytes32 _requestId = requestRandomness(keyhash, fee);
        requestIds[_requestId] = _roomId;

        emit RequestedRandomness(_requestId);
    }

    /**
     * Required to override to request randomness from VRFCoordinator
     */
    function fulfillRandomness(bytes32 _requestId, uint256 _randomness)
        internal
        override
    {
        require(_randomness > 0, "random not found");

        mostRecentRandomness = _randomness;

        bytes32 roomId = requestIds[_requestId];

        emit FulfilledRandomness(roomId, _randomness);
        DuelloInterface(governance.duello()).endDuel(roomId, _randomness);
    }
}
