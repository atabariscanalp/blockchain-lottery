// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

import {GovernanceInterface} from "./interfaces/GovernanceInterface.sol";
import {LotteryInterface} from "./interfaces/LotteryInterface.sol";
import {DuelloInterface} from "./interfaces/DuelloInterface.sol";

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract RandomNumberGenerator is VRFConsumerBase {
    bytes32 internal keyhash;
    uint256 internal fee;
    mapping(bytes32 => bytes32) internal requestIds;
    uint256 public mostRecentRandomness;

    GovernanceInterface public governance;

    event RequestedRandomness(bytes32 requestId);
    event FulfilledRandomness();

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
    function getRandom() external returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        require(keyhash != bytes32(0), "Must have a valid keyhash!");

        bytes32 _requestId = requestRandomness(keyhash, fee);
        requestIds[_requestId] = "";

        emit RequestedRandomness(_requestId);
    }

    /**
     *	Requests randomness to VRFCoordinator
     *	Overloads getRandom function to work with Duello Contract
     */
    function getRandom(bytes32 _roomId) external returns (bytes32 requestId) {
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

        emit FulfilledRandomness();

        bool isLottery = requestIds[_requestId] == "";

        if (isLottery) {
            LotteryInterface(governance.lottery()).endLottery(_randomness);
        } else {
            bytes32 roomId = requestIds[_requestId];
            DuelloInterface(governance.duello()).endDuello(roomId, _randomness);
        }
    }
}
