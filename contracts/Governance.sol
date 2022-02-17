// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

contract Governance {
    address public lottery;
    address public randomness;
    address public duello;
    uint256 private oneTime;

    constructor() {
        oneTime = 1;
    }

    function init(
        address _lottery,
        address _randomness,
        address _duello
    ) public {
        require(_randomness != address(0), "randomness address is null");
        require(_lottery != address(0), "lottery address is null");
        require(_duello != address(0), "duello address is null");
        require(oneTime != 0, "cannot call init again!");

        oneTime--;
        randomness = _randomness;
        lottery = _lottery;
        duello = _duello;
    }
}