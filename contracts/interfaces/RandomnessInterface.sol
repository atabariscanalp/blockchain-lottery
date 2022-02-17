// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

interface RandomnessInterface {
    function randomNumber(uint256) external view returns (uint256);

    function getRandom(bytes32 _roomId) external;
}
