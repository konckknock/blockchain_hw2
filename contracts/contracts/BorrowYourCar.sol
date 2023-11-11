// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment the line to use openzeppelin/ERC721
// You can use this dependency directly because it has been installed by TA already
 import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Uncomment this line to use console.log
 import "hardhat/console.sol";

contract BorrowYourCar is ERC721 {

    // use a event if you want
    // to represent time you can choose block.timestamp
    event CarBorrowed(uint256 carTokenId, address borrower, uint256 startTime, uint256 duration);

    // maybe you need a struct to store car information
    struct Car {
        address owner;
        address borrower;
        uint256 borrowUntil;
    }

    mapping(uint256 => Car) public cars;
    //mapping(address => Car[]) private userCars;// A map from car index to its information
    // ...

    constructor(string memory name_, string memory symbol_)
        ERC721(name_,symbol_)
    {
        mint(0,0xDE21c4f130ab2036D552Bc63C22a8012fc2C55C1);
        mint(1,0xDE21c4f130ab2036D552Bc63C22a8012fc2C55C1);
        mint(2,0x16eddB83B0B733BaE796E04992ED0671cd977d83);
        mint(3,0xc11D59a22D463Dc65Dc37598C9e131ED2798d208);
        mint(4,0x2b84Db2a12434935ba89af80D79b89A372234887);
    }
        // maybe you need a constructor

    function mint(uint256 tokenId,address owner) public{

        cars[tokenId].owner=owner;
        cars[tokenId].borrower=address(0);
        cars[tokenId].borrowUntil=0;
    }
    function getOwner(uint256 tokenId) public view returns(address){
        return cars[tokenId].owner;
    }
    function getUser(uint256 tokenId) public view returns(address){
        return userOf(tokenId);
    }
    function getBorrowUtil(uint256 tokenId) public view returns(uint256){
        return cars[tokenId].borrowUntil;
    }
    //返回当前用户车的编号数组
   function getUserCars(address owner) public view returns (uint256[] memory){
       uint256 cnt=0;
        for(uint256 i=0;i<5;i++)
        {
            if(cars[i].owner==owner)
            {
                cnt++;
            }
        }
       uint256[] memory indices = new uint256[](cnt);
       uint256 index = 0;
       for(uint256 i=0;i<5;i++)
       {
           if(cars[i].owner==owner)
           {
               indices[index] = i;
               index ++;
           }
       }
       return indices;
   }

    function getAvailableCars() public view returns(uint256[] memory){
        uint256 cnt=0;
        for(uint256 i=0;i<5;i++)
        {
            if(userOf(i)==address (0))
            {
                cnt++;
            }
        }
        uint256[] memory indices = new uint256[](cnt);
        uint256 index = 0;
        for(uint256 i=0;i<5;i++)
        {
            if(userOf(i)==address (0))
            {
                indices[index] = i;
                index ++;
            }
        }
        return indices;
    }

    function userOf(uint256 tokenId) public view virtual returns(address){
        if(cars[tokenId].borrowUntil>=block.timestamp)
        {
        return cars[tokenId].borrower;
        }
        else {
            return address (0);
        }
    }
    function borrowCar (uint256 tokenId, address user,uint64 expires) public{
        Car storage carInfo = cars[tokenId];
        carInfo.borrower=user;
        carInfo.borrowUntil=block.timestamp+expires;
        emit CarBorrowed(tokenId,user,block.timestamp,expires);
    }

}