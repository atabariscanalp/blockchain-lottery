// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

interface GovernanceInterface {
    function randomness() external view returns (address);

    function duel() external view returns (address);
}
