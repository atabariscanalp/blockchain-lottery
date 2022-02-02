// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

contract Governance {
    address public lottery;
    address public randomness;
    address public duello;
    uint256 public oneTime;

    constructor() {
        oneTime = 1;
    }

    function init(
        address _lottery,
        address _randomness,
        address _duello
    ) public {
        require(_randomness != address(0), "governance/no-randomnesss-address");
        require(_lottery != address(0), "no-lottery-address-given");

        oneTime--;
        randomness = _randomness;
        lottery = _lottery;
        duello = _duello;
    }
}
