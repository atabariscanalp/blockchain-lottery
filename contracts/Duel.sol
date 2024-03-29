// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import {RandomnessInterface} from "./interfaces/RandomnessInterface.sol";
import {GovernanceInterface} from "./interfaces/GovernanceInterface.sol";

import "../node_modules/hardhat/console.sol";

contract Duel {
    GovernanceInterface public governance;

    address owner;
    address contractOwner;

    event EndDuel(uint256 randomness);
    event ForceEndDuel(address payable withdrawer);
    event EnterDuel(address payable player);
    event StartDuel();
    event TransferOwnership(address newOwner);

    struct DuelPlayer {
        address payable _address;
        uint256 _betAmount;
        bool _hasWon;
    }

    mapping(bytes32 => DuelPlayer[]) public duelRooms;

    constructor(address _governance) {
        governance = GovernanceInterface(_governance);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can call it");
        _;
    }

    modifier onlyContractOwner() {
        require(msg.sender == contractOwner, "only contractOwner can call it");
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;

        emit TransferOwnership(newOwner);
    }

    // TODO: add withdraw function!
    function withdraw(address payable toAddress) external onlyOwner {
        (bool sent,) = toAddress.call{value : address(this).balance}('');
        require(sent, "failed to send remaining balance");
    }

    // TODO: Make function ERC20 Token compatible
    // msg.value = 1e18 means 1 MATIC
    function enterDuel(bytes32 _roomId) external payable {
        require(duelRooms[_roomId].length <= 2, "Room is full.");
        require(
            duelRooms[_roomId].length == 1
            ? duelRooms[_roomId][0]._betAmount == msg.value
            : true,
            "players should bet same amount"
        );
        // TODO: struct creation can be optimized!
        /// create duel player
        DuelPlayer memory duelPlayer = DuelPlayer({
        _address : payable(msg.sender),
        _betAmount : msg.value,
        _hasWon : false
        });

        /// push duel player to the duel room
        duelRooms[_roomId].push(duelPlayer);

        emit EnterDuel(duelPlayer._address);

        /// check if room is full, if so start duel
        if (duelRooms[_roomId].length == 2) {
            startDuel(_roomId);
        }
    }

    /// run this function when the other user doesn't join to the room
    function forceEndDuel(bytes32 _roomId) external {
        address payable toAddress = duelRooms[_roomId][0]._address;
        toAddress.transfer(duelRooms[_roomId][0]._betAmount);

        emit ForceEndDuel(toAddress);
    }

    /// starts the duel when the room is full
    function startDuel(bytes32 _roomId) internal {
        require(duelRooms[_roomId].length == 2, "Room should be full.");

        RandomnessInterface(governance.randomness()).getRandom(_roomId);
        emit StartDuel();
    }

    function endDuel(bytes32 _roomId, uint256 _randomness) public onlyContractOwner {
        require(duelRooms[_roomId].length == 2, "Room is not full.");

        DuelPlayer[] memory duelPlayers = duelRooms[_roomId];
        console.log("[END_DUEL] duelPlayers count: %s", duelPlayers.length);
        // TODO: what if betAmount overflows!!!
        uint256 betAmount = duelPlayers[0]._betAmount * 2;
        console.log("[END_DUEL] bet amount: %s", betAmount / 10 ** 18);

        uint256 indexOfWinner = _randomness % 2;
        console.log("[END_DUEL] index of winner: %s", indexOfWinner);
        duelRooms[_roomId][indexOfWinner]._hasWon = true;
        address payable winner = duelPlayers[indexOfWinner]._address;
        winner.transfer((betAmount * 9) / 10);
        console.log(
            "[END_DUEL] win amount: %s",
            ((betAmount * 9) / 10) / 10 ** 18
        );

        emit EndDuel(_randomness);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // TODO: change function name
    function getRoomCount(bytes32 _roomId) external view returns (uint256) {
        return duelRooms[_roomId].length;
    }

    function checkPlayerWon(bytes32 _roomId, uint256 index)
    external
    view
    returns (bool)
    {
        require(duelRooms[_roomId].length == 2, "room should be full!");
        require(index <= 1, "index can't be bigger than 1.");

        return duelRooms[_roomId][index]._hasWon;
    }

    function getRoomPlayer(bytes32 _roomId, uint256 index)
    external
    view
    returns (address)
    {
        require(index <= 1, "index can't be bigger than 1");

        DuelPlayer[] memory room = duelRooms[_roomId];

        return room.length > index ? room[index]._address : address(0);
    }
}
