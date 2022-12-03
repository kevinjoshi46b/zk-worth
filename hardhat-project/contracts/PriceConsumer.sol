// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumer is Ownable {
    // Token mapped to its TOKEN/USD chainlink feed
    mapping(address => address) feeds;

    // Chainlink-specific
    function setFeeds(address[] calldata _tokens, address[] calldata _feeds)
        external
        onlyOwner
    {
        for (uint256 i = 0; i < _tokens.length; ) {
            feeds[_tokens[i]] = _feeds[i];
            unchecked {
                i++;
            }
        }
    }

    function getPrice(address _token) public view returns (int256) {
        require(
            feeds[_token] != address(0),
            "Feed does not exist for this token"
        );
        (, int256 price, , , ) = AggregatorV3Interface(feeds[_token])
            .latestRoundData();
        return price;
    }

    function getPrices(address[] calldata _tokens)
        external
        view
        returns (int256[] memory)
    {
        int256[] memory prices = new int256[](_tokens.length);
        for (uint256 i = 0; i < _tokens.length; ) {
            prices[i] = getPrice(_tokens[i]);
            unchecked {
                i++;
            }
        }
        return prices;
    }

    // Native and ERC20 Balances
    function getNativeBalance(address _user) external view returns (uint256) {
        return address(_user).balance;
    }

    function getBalance(address _user, address _token)
        public
        view
        returns (uint256)
    {
        return IERC20(_token).balanceOf(_user);
    }

    function getBalances(address _user, address[] calldata _tokens)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory _balances = new uint256[](_tokens.length);
        for (uint256 i = 0; i < _tokens.length; ) {
            _balances[i] = getBalance(_user, _tokens[i]);
            unchecked {
                i++;
            }
        }
        return _balances;
    }
}
