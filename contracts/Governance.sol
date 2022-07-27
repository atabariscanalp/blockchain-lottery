// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

contract Governance {
    address public randomness;
    address public duel;
    uint256 private oneTime;

    constructor() {
        oneTime = 1;
    }

    function init(address _randomness, address _duel) public {
        require(_randomness != address(0), "randomness address is null");
        require(_duel != address(0), "duel address is null");
        require(oneTime != 0, "cannot call init again!");

        oneTime--;
        randomness = _randomness;
        duel = _duel;
    }
}
