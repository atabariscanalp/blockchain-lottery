// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

import {RandomnessInterface} from "./interfaces/RandomnessInterface.sol";
import {GovernanceInterface} from "./interfaces/GovernanceInterface.sol";

import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

contract Lottery is KeeperCompatibleInterface {
    address payable[] public players;
    address payable[] public winners;
    address payable public latestWinner;

    uint256 private ticketPrice;
    uint256 public lotteryId;

    uint256 public immutable interval;
    uint256 public lastTimeStamp;

    GovernanceInterface public governance;

    enum LotteryState {
        OPEN,
        CLOSED,
        CALCULATING_WINNER
    }
    LotteryState public lotteryState;

    // Events
    event BuyTicket(address sender);
    event CalculatingWinner();
    event EndLottery(uint256 randomness);
    event StartLottery();
    event CheckUpkeep(bool val);
    event ForceEnd(int256 val);

    constructor(uint256 _interval, address _governance) {
        interval = _interval;
        governance = GovernanceInterface(_governance);

        lotteryId = 1;
        lotteryState = LotteryState.CLOSED;
        // TODO: Change the ticketPrice later
        ticketPrice = 0.005 ether; // 0.005 ETH
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded =
            ((block.timestamp - lastTimeStamp) > interval) &&
            lotteryState == LotteryState.OPEN;

        emit CheckUpkeep(upkeepNeeded);
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        lastTimeStamp = block.timestamp;
        lotteryId++;
        lotteryState = LotteryState.CALCULATING_WINNER;

        if (players.length == 0) {
            lotteryState = LotteryState.CLOSED;
            emit EndLottery(0);
        } else {
            emit CalculatingWinner();
            pickWinner();
        }
    }

    function checkPlayerHasJoined(address _user) private view returns (bool) {
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i] == _user) {
                return false;
            }
        }
        return true;
    }

    function buyTicket() external payable {
        require(msg.value == ticketPrice, "Not enough ETH!");
        require(
            checkPlayerHasJoined(msg.sender),
            "You can only buy one ticket!"
        );
        require(lotteryState == LotteryState.OPEN, "Lottery is not open yet!");

        players.push(payable(msg.sender));

        emit BuyTicket(msg.sender);
    }

    function startLottery() external {
        require(
            lotteryState == LotteryState.CLOSED,
            "Can't start a new lottery yet!"
        );
        lotteryState = LotteryState.OPEN;
        lastTimeStamp = block.timestamp;

        emit StartLottery();
    }

    function pickWinner() private {
        require(
            lotteryState == LotteryState.CALCULATING_WINNER,
            "Not at calculating winner state"
        );

        RandomnessInterface(governance.randomness()).getRandom();
    }

    function forceEndLottery() public {
        lotteryState = LotteryState.CLOSED;
        players = new address payable[](0);
        emit ForceEnd(-1);
    }

    function endLottery(uint256 _randomness) public {
        require(
            lotteryState == LotteryState.CALCULATING_WINNER,
            "Not at calculating winner state"
        );
        require(_randomness > 0, "random-not-found");

        uint256 winnerIndex = _randomness % players.length;
        latestWinner = players[winnerIndex];
        uint256 ticketPool = players.length * ticketPrice;
        players = new address payable[](0);
        lotteryState = LotteryState.CLOSED;
        players[winnerIndex].transfer((ticketPool * 9) / 10);

        emit EndLottery(_randomness);
    }

    function getPot() external view returns (uint256) {
        return players.length * ticketPrice;
    }

    function getPlayerCount() external view returns (uint256) {
        return players.length;
    }
}
