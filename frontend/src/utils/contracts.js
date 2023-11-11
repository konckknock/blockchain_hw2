import Address from './address.json'
import BorrowYourCar from './BorrowYourCar.json'

 const Web3  = require('web3');


let web3 = new  Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

const ABI = BorrowYourCar.abi
const address = Address.BorrowYourCar

const borrowcontract =new web3.eth.Contract(ABI,address)

export {web3,borrowcontract}