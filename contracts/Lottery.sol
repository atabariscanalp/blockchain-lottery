// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract Lottery is VRFConsumerBase {
    address payable[] public players;
    address payable public winner;

    uint256 internal fee;
    bytes32 internal keyhash;
    uint256 internal randomness;
    mapping(bytes32 => address) internal requestIdToAddress;

    uint256 public ticketPrice;

    uint256 public ticketPool;

    struct DuelPlayer {
        address payable _address;
        uint256 _amount;
        bool _hasWon;
    }

    mapping(string => DuelPlayer[2]) public duelRooms;

    AggregatorV3Interface internal ethUsdPriceFeed;

    enum LotteryState {
        OPEN,
        CLOSED,
        CALCULATING_WINNER
    }
    LotteryState public lotteryState;

    // Events
    event RequestedRandomness(bytes32 requestId);

    event BuyTicket(address _buyer);

    event Transfer(address _transferredTo, uint256 _amount); // TODO: Check if string is stored in memory!

    constructor(
        address _priceFeedAddress,
        address _vrfCoordinator,
        address _link,
        uint256 _fee,
        bytes32 _keyhash
    ) public VRFConsumerBase(_vrfCoordinator, _link) {
        ethUsdPriceFeed = AggregatorV3Interface(_priceFeedAddress);
        lotteryState = LotteryState.CLOSED;
        fee = _fee;
        keyhash = _keyhash;
        ticketPrice = 5 * (10**18); // 5$ TODO: Check the price later!
    }

    function buyTicket() external payable {
        uint256 ticketFee = getTicketFee();
        // Lottery should be open to buy a ticket
        require(lottery_state == LotteryState.OPEN, "Lottery is not open!");
        // msg.value should be equal to ticket price
        require(msg.value == ticketFee, "Not enough ETH!");

        players.push(msg.sender);

        ticketPool += ticketFee;

        emit BuyTicket(msg.sender);
    }

    function getTicketFee() public view returns (uint256) {
        (, int256 price, , , ) = ethUsdPriceFeed.latestRoundData();
        uint256 adjustedPrice = uint256(price) * (10**10); // 18 Decimals
        uint256 costToEnter = (ticketPrice * (10**18)) / adjustedPrice;

        return costToEnter;
    }

    function getDuelFee(uint256 _amountDollar) public view returns (uint256) {
        (, int256 price, , , ) = ethUsdPriceFeed.latestRoundData();
        uint256 adjustedPrice = uint256(price) * (10**10); // 18 Decimals
        uint256 duelFee = (_amountDollar * (10**18)) / adjustedPrice;

        return duelFee;
    }

    // ----------------------- DUEL FUNCTIONS ----------------------------

    /*

		TODO: optimize this function later
		string calldata _id can be bytes32 

	*/
    function enterDuel(uint256 _amountDollar, string calldata _id)
        external
        payable
    {
        uint256 duelFee = getDuelFee(_amountDollar);

        require(msg.value == duelFee, "Not enough ETH!");

        DuelPlayer memory duelPlayer = DuelPlayer({
            _address: msg.sender,
            _amount: duelFee,
            _hasWon: false
        });
        duelRooms[_id].push(duelPlayer);
    }

    function startDuel(string calldata _id) external {
        address[2] duelPlayers = duelRooms[_id];
        uint256 balance = duelPlayers[0][_amount];

        bytes32 requestId = getRandomNumber();
        emit RequestedRandomness(requestId);

        uint256 indexOfWinner = duelPlayers.length % randomness;
        address payable duelWinner = duelPlayers[indexOfWinner];
        duelWinner.transfer(((balance * 2) * 9) / 10); // gives 90% of the total amount to the winner.

        // Possible reentrancy vulnerabilities. Avoid state changes after transfer.
        duelRooms[_id][indexOfWinner][_hasWon] = true;
    }

    function forceEndDuel(string calldata _id) external {
        for (uint256 i = 0; i < duelRooms[_id].length; i++) {
            duelRooms[_id][i][_address].transfer(duelRooms[_id][_amount]);
        }
        // Possible reentrancy vulnerabilities. Avoid state changes after transfer.
        delete duelRooms[_id];
    }

    function endDuel(string calldata _id) external {
        delete duelRooms[_id];
    }

    // ----------------------- DUEL FUNCTIONS ----------------------------

    /*

		TODO: Complete the startLottery function

		startLottery should start a countdown
		for 24 hours

	*/
    function startLottery() external {
        require(lotteryState == LotteryState.CLOSED, "Lottery is not closed!");
        lotteryState = LotteryState.OPEN;
    }

    /*

		TODO: Complete the endLottery function

		endLottery should be executed when the countdown ends.

	*/
    function endLottery() external {
        require(
            lotteryState == LotteryState.OPEN,
            "Lottery should be open to close!"
        );

        lotteryState = LotteryState.CALCULATING_WINNER;
        bytes32 requestId = getRandomNumber();

        emit RequestedRandomness(requestId);
    }

    // ----------------------- RANDOMNESS FUNCTIONS ----------------------------

    /**
     * Requests randomness
     */
    function getRandomNumber() internal returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        return requestRandomness(keyHash, fee);
    }

    // Required to override to request randomness from VRFCoordinator
    function fulfillRandomness(bytes32 _requestId, uint256 _randomness)
        internal
        override
    {
        require(
            lotteryState == LotteryState.CALCULATING_WINNER,
            "Lottery is not over yet!"
        );
        require(_randomness > 0, "random not found");

        randomness = _randomness;

        // FIXME: Move rest of the function

        uint256 indexOfWinner = _randomness % players.length;
        winner = players[indexOfWinner];

        /*

			FIXME: Check it later! 
			90% of the ticketPool money goes to the winner,
			10% stays in the wallet

		*/
        winner.transfer((ticketPool * 9) / 10);

        /*

			FIXME:
			Linter: Possible reentrancy vulnerabilities. Avoid state changes after transfer. 
			players = new...

		*/
        players = new address payable[](0);
        ticketPool = 0;
        lotteryState = LotteryState.CLOSED;
    }

    // ----------------------- RANDOMNESS FUNCTIONS ----------------------------
}
