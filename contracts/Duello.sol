// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

import {RandomnessInterface} from "./interfaces/RandomnessInterface.sol";
import {GovernanceInterface} from "./interfaces/GovernanceInterface.sol";

contract Duel {
    GovernanceInterface public governance;

    event EndDuel(uint256 randomness);
    event ForceEndDuel(address payable withdrawer);

    struct DuelPlayer {
        address payable _address;
        uint256 _betAmount;
        bool _hasWon;
    }
    mapping(bytes32 => DuelPlayer[]) public duelRooms;

    constructor(address _governance) {
        governance = GovernanceInterface(_governance);
    }

    function enterDuel(bytes32 _roomId) external payable {
        require(duelRooms[_roomId].length < 2, "Room is full.");
        DuelPlayer memory duelPlayer = DuelPlayer({
            _address: payable(msg.sender),
            _betAmount: msg.value,
            _hasWon: false
        });

        duelRooms[_roomId].push(duelPlayer);
    }

    function forceEndDuel(bytes32 _roomId) external {
        address payable toAddress = duelRooms[_roomId][0]._address;
        toAddress.transfer(duelRooms[_roomId][0]._betAmount);

        emit ForceEndDuel(toAddress);
    }

    function startDuel(bytes32 _roomId) external {
        RandomnessInterface(governance.randomness()).getRandom(_roomId);
    }

    function endDuel(bytes32 _roomId, uint256 _randomness) public {
        require(duelRooms[_roomId].length == 2, "Room is not full.");

        DuelPlayer[] memory duelPlayers = duelRooms[_roomId];
        uint256 betAmount = duelPlayers[0]._betAmount * 2;

        uint256 indexOfWinner = 2 % _randomness;
        duelPlayers[indexOfWinner]._hasWon = true;
        address payable winner = duelPlayers[indexOfWinner]._address;
        winner.transfer((betAmount * 9) / 10);

        emit EndDuel(_randomness);
    }
}
