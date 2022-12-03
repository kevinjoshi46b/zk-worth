// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ZKWorth is Ownable {
    struct RequestMetadata {
        string sender;
        string receiver;
        uint256 threshold;
        int8 status;
        bool result;
        string proof;
    }

    struct User {
        uint256 publicKey;
        string primaryWalletAddress;
        string[] secondaryWalletAddresses;
        string[] incomingRequests;
        string[] outgoingRequests;
    }

    string[] internal publicKeys;
    RequestMetadata[] internal requestMetadata;

    mapping(string => User) internal accounts;

        function isUniquePublicKey(
            string calldata _publicKey
        ) external view returns (bool) {
            bytes32 _hashedPublicKey = keccak256(abi.encodePacked(_publicKey));
            for (uint256 _i = 0; _i < publicKeys.length; ) {
                if (
                    _hashedPublicKey == keccak256(abi.encodePacked(publicKeys[_i]))
                ) {
                    return false;
                }
                unchecked {
                    _i++;
                }
            }
            return true;
        }

    function isUniqueUsername(
        string calldata _username
    ) external view returns (bool) {
        if (accounts[_username].publicKey == 0) {
            return true;
        } else {
            return false;
        }
    }

    function setAccount(
        string calldata _username,
        string calldata _publicKey,
        string calldata _primaryWalletAddress
    ) external onlyOwner {
        require(bytes(_username).length != 0, "Username not provided");
        require(bytes(_publicKey).length != 0, "Public key not provided");
        require(
            bytes(_primaryWalletAddress).length != 0,
            "Primary wallet address not provided"
        );
        require(
            this.isUniqueUsername(_username),
            "Account with the given username already exists"
        );
        User storage _account = accounts[_username];
        publicKeys.push(_publicKey);
        _account.publicKey = publicKeys.length;
        _account.primaryWalletAddress = _primaryWalletAddress;
    }

    function getAccount(
        string calldata _username
    ) external view returns (User memory) {
        return accounts[_username];
    }

    function getPublicKey(
        string calldata _username
    ) external view returns (string memory) {
        require(
            !this.isUniqueUsername(_username),
            "Account with the given username does not exist"
        );
        return publicKeys[accounts[_username].publicKey - 1];
    }

    function getPrimaryWalletAddress(
        string calldata _username
    ) external view returns (string memory) {
        return accounts[_username].primaryWalletAddress;
    }

    function setSecondaryWalletAddress(
        string calldata _username,
        string calldata _secondaryWalletAddress
    ) external onlyOwner {
        require(
            !this.isUniqueUsername(_username),
            "Account with the given username does not exist"
        );
        require(
            bytes(_secondaryWalletAddress).length != 0,
            "Secondary wallet address not provided"
        );
        accounts[_username].secondaryWalletAddresses.push(
            _secondaryWalletAddress
        );
    }

    function removeSecondaryWalletAddress(
        string calldata _username,
        string calldata _secondaryWalletAddress
    ) external onlyOwner {
        require(
            !this.isUniqueUsername(_username),
            "Account with the given username does not exist"
        );
        require(
            bytes(_secondaryWalletAddress).length != 0,
            "Secondary wallet address not provided"
        );
        string[] storage secondaryWalletAddresses = accounts[_username]
            .secondaryWalletAddresses;
        bytes32 _hashedSecondaryWalletAddress = keccak256(
            abi.encodePacked(_secondaryWalletAddress)
        );
        for (uint256 _i = 0; _i < secondaryWalletAddresses.length; ) {
            if (
                _hashedSecondaryWalletAddress ==
                keccak256(abi.encodePacked(secondaryWalletAddresses[_i]))
            ) {
                secondaryWalletAddresses[_i] = secondaryWalletAddresses[
                    secondaryWalletAddresses.length - 1
                ];
                secondaryWalletAddresses.pop();
                break;
            }
            unchecked {
                _i++;
            }
        }
    }

    function getSecondaryWalletAddresses(
        string calldata _username
    ) external view returns (string[] memory) {
        return accounts[_username].secondaryWalletAddresses;
    }

    function setRequestMetadata(
        uint256 _id,
        string calldata _sender,
        string calldata _receiver,
        uint256 _threshold,
        int8 _status,
        bool _result,
        string calldata _proof
    ) external onlyOwner {
        require(bytes(_sender).length != 0, "Request sender not provided");
        require(bytes(_receiver).length != 0, "Request receiver not provided");
        if (_id == 0) {
            requestMetadata.push(
                RequestMetadata(
                    _sender,
                    _receiver,
                    _threshold,
                    _status,
                    _result,
                    _proof
                )
            );
        } else {
            require(_id <= requestMetadata.length, "Invalid id provided");
            RequestMetadata storage _metadata = requestMetadata[_id - 1];
            _metadata.sender = _sender;
            _metadata.receiver = _receiver;
            _metadata.threshold = _threshold;
            _metadata.status = _status;
            _metadata.result = _result;
            _metadata.proof = _proof;
        }
    }

    function getLatestId() external view onlyOwner returns (uint256) {
        return requestMetadata.length;
    }

    function getRequestMetadata(
        uint256 _id
    ) external view returns (RequestMetadata memory) {
        require(
            _id != 0 && _id <= requestMetadata.length,
            "Invalid id provided"
        );
        return requestMetadata[_id - 1];
    }

    function getRequestMetadatas(
        uint256[] calldata _ids
    ) external view returns (RequestMetadata[] memory) {
        uint256 _requestMetadataLength = requestMetadata.length;
        for (uint256 _i = 0; _i < _ids.length; ) {
            uint256 _id = _ids[_i];
            require(
                _id != 0 && _id <= _requestMetadataLength,
                "One of the id provided is invalid"
            );
            unchecked {
                _i++;
            }
        }
        RequestMetadata[] memory _requestMetadatas = new RequestMetadata[](
            _ids.length
        );
        for (uint256 _i = 0; _i < _ids.length; ) {
            _requestMetadatas[_i] = requestMetadata[_ids[_i] - 1];
            unchecked {
                _i++;
            }
        }
        return _requestMetadatas;
    }

    function setRequests(
        string calldata _sender,
        string calldata _senderId,
        string calldata _receiver,
        string calldata _receiverId
    ) external onlyOwner {
        require(bytes(_sender).length != 0, "Request sender not provided");
        require(
            !this.isUniqueUsername(_sender),
            "Sender's account does not exist"
        );
        require(
            bytes(_senderId).length != 0,
            "Sender's request id not provided"
        );
        require(bytes(_receiver).length != 0, "Request receiver not provided");
        require(
            !this.isUniqueUsername(_receiver),
            "Receiver's account does not exist"
        );
        require(
            bytes(_receiverId).length != 0,
            "Receiver's request id not provided"
        );
        accounts[_sender].outgoingRequests.push(_senderId);
        accounts[_receiver].incomingRequests.push(_receiverId);
    }

    function getRequests(
        string calldata _username
    ) external view returns (string[][2] memory) {
        return [
            accounts[_username].incomingRequests,
            accounts[_username].outgoingRequests
        ];
    }

    function getIncomingRequests(
        string calldata _username
    ) external view returns (string[] memory) {
        return accounts[_username].incomingRequests;
    }

    function getOutgoingRequests(
        string calldata _username
    ) external view returns (string[] memory) {
        return accounts[_username].outgoingRequests;
    }
}
