
import utils  from 'web3';
import './App.css';
import I1 from './image/1.png'
import I2 from './image/2.png'
import I3 from './image/3.jpg'
import I4 from './image/4.jpg'
import I5 from './image/5.jpg'
import {useEffect, useState} from 'react';
import  {web3,borrowcontract} from "./utils/contracts";
import Web3 from "web3";


const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'
interface Car {
    tokenId: string;
    owner: string;
}
const pageStyle = {
    display: 'flex',

};

function App() {

    const [account, setAccount] = useState('')
    const [availableCars, setAvailableCars] = useState<number[]>([]);
    const [myCars, setMyCars] = useState<number[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [borrowUtils, setBorrowUtils] = useState<string[]>([]);
    const [borrowTime, setBorrowTime] = useState<string>('');
    const [carNumber, setCarNumber] = useState<string>('');

    const cars: Car[] = [
        {
            tokenId: '0',
            owner: '0xDE21c4f130ab2036D552Bc63C22a8012fc2C55C1',

        },
        {
            tokenId: '1',
            owner: '0xDE21c4f130ab2036D552Bc63C22a8012fc2C55C1',

        },
        {
            tokenId: '2',
            owner: '0x16eddB83B0B733BaE796E04992ED0671cd977d83',
        },
        {
            tokenId:'3',
            owner:'0xc11D59a22D463Dc65Dc37598C9e131ED2798d208'
        },
        {
            tokenId:'4',
            owner:'0x2b84Db2a12434935ba89af80D79b89A372234887'
        }
    ]
    //连接钱包
    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const {ethereum} = window;
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if (accounts && accounts.length) {
                    setAccount(accounts[0])

                }
            }
        }
        initCheckAccounts()
    }, [])

    useEffect(() => {
        const fetchAvailableCars = async () => {
            try {
                const cars = await borrowcontract.methods.getAvailableCars().call();
                setAvailableCars(cars);
            } catch (error) {
                console.error('Error fetching available cars:', error);
            }
        };

        fetchAvailableCars();
    }, []);

    useEffect(() => {
        const getUserAndBorrowUtil = async () => {
            const newUsers: string[] = [];
            const newBorrowUtils: string[] = [];

            for (let i = 0; i < 5; i++) {
                const user = await borrowcontract.methods.getUser(i).call();
                const borrowUtil = await borrowcontract.methods.getBorrowUtil(i).call();

                newUsers.push(user);
                newBorrowUtils.push(borrowUtil);
            }

            setUsers(newUsers);
            setBorrowUtils(newBorrowUtils);
        };

        getUserAndBorrowUtil();
    }, []);
    //切换用户
    const onClickConnectWallet = async () => {
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        // @ts-ignore
        const {ethereum} = window;
        if (!Boolean(ethereum && ethereum.isMetaMask)) {
            alert('MetaMask is not installed!');
            return
        }
        try {
            // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
            if (ethereum.chainId !== 5777) {
                const chain = {
                    chainId: 5777, // Chain-ID
                    chainName: 'Ganache Test Chain', // Chain-Name
                    rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
                };

                try {
                    // 尝试切换到本地网络
                    await ethereum.request({method: "wallet_switchEthereumChain", params: [{chainId: chain.chainId}]})
                } catch (switchError: any) {
                    // 如果本地网络没有添加到Metamask中，添加该网络
                    if (switchError.code === 4902) {
                        await ethereum.request({
                            method: 'wallet_addEthereumChain', params: [chain]
                        });
                    }
                }
            }
            // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
            await ethereum.request({method: 'eth_requestAccounts'});
            // 获取小狐狸拿到的授权用户列表
            const accounts = await ethereum.request({method: 'eth_accounts'});
            // 如果用户存在，展示其account，否则显示错误信息
            setAccount(accounts[0] || 'Not able to get accounts');
            console.log((accounts[0]))
            const cars = await borrowcontract.methods.getUserCars(accounts[0]).call();
            setMyCars(cars);
        } catch (error: any) {
            alert(error.message)
        }
    }





    const onClickBorrow = async () => {
        const carNumberValue = parseInt(carNumber, 10);
        const timestamp = convertToTimestamp(borrowTime);

        if (account === cars[carNumberValue].owner) {
            alert('您已经是车的主人');
        } else {
            setTimeout(async () => {
                await borrowcontract.methods.borrowCar(carNumberValue, account, timestamp).send({
                    from: account
                });
            }, 1000);
        }
    };
    const handleCarNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const carNumberValue = parseInt(value, 10);
        // 检查账户与车的主人是否相等
        if (account === cars[carNumberValue].owner) {
            alert('您已经是车的主人');
            return;
        }
        setCarNumber(value);
    };
    const handleBorrowTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        // 将以天为单位的时间转换为时间戳
        setBorrowTime(value);
    };

    const convertToTimestamp = (days: string): number => {
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const daysNumber = parseInt(days, 10);
        const timestamp = Date.now() + daysNumber * millisecondsPerDay;
        return timestamp;
    };
    interface CarBorrowedEvent {
        tokenId: number;
        user: string;
        timestamp: number;
        expires: number;
    }

    borrowcontract.events.CarBorrowed()
        .on('data', (event :CarBorrowedEvent) => {
            window.location.reload();
        })
return (
    <div style={pageStyle}>
            <h1>车友车行</h1>
            <div className='account'>
                { <button onClick={onClickConnectWallet}>连接钱包</button>}
                <div>当前用户：{account === '' ? '无用户连接' : account}</div>
                <div>当前用户拥有的车辆编号: {myCars.join(',')}</div>
                <div>可被借用的汽车编号：:{availableCars.join(',')}</div>
                <div>
                    <input type="text" value={carNumber} onChange={handleCarNumberChange} placeholder="请输入车的编号" />
                </div>
                <div>
                    <input type="text" value={borrowTime} onChange={handleBorrowTimeChange} placeholder="请输入借车时间（天）" />
                </div>
                <button onClick={onClickBorrow}>借用</button>
                <div>
                    <img src={I1} alt="Image 1" style={{width: '400px',height:'200px'}}/>
                    <div>车辆编号：{ cars[0].tokenId }</div>
                    <div>拥有者：{cars[0].owner }</div>
                    <div>借用者 ：{ users[0]=== '0'? '无借用者' :users[0] }</div>
                    <div>借用期限：{borrowUtils[0]=== '0' ? '无借用者':borrowUtils[0]}</div>
                </div>
                <div>
                    <img src={I2} alt="Image 2" style={{width: '400px',height:'200px'}}/>
                    <div>车辆编号：{ cars[1].tokenId }</div>
                    <div>拥有者：{cars[1].owner }</div>
                    <div>借用者 ：{ users[1]=== '0'? '无借用者' :users[1] }</div>
                    <div>借用期限：{borrowUtils[1]=== '0' ? '无借用者':borrowUtils[1]}</div>

                </div>
                <div>
                    <img src={I3} alt="Image 3" style={{width: '400px',height:'200px'}}/>
                    <div>车辆编号：{ cars[2].tokenId }</div>
                    <div>拥有者：{cars[2].owner }</div>
                    <div>借用者 ：{ users[2]=== '0'? '无借用者' :users[2] }</div>
                    <div>借用期限：{borrowUtils[2]=== '0' ? '无借用者':borrowUtils[2]}</div>

                </div>
                <div>
                    <img src={I4} alt="Image 4" style={{width: '400px',height:'200px'}}/>
                    <div>车辆编号：{ cars[3].tokenId }</div>
                    <div>拥有者：{cars[3].owner }</div>
                    <div>借用者 ：{ users[3]=== '0'? '无借用者' :users[3] }</div>
                    <div>借用期限：{borrowUtils[3]=== '0' ? '无借用者':borrowUtils[3]}</div>

                </div>
                <div>
                    <img src={I5} alt="Image 5"style={{width: '400px',height:'200px'}} />
                    <div>车辆编号：{ cars[4].tokenId }</div>
                    <div>拥有者：{cars[4].owner }</div>
                    <div>借用者 ：{ users[4]=== '0'? '无借用者' :users[4] }</div>
                    <div>借用期限：{borrowUtils[4]=== '0' ? '无借用者':borrowUtils[4]}</div>

                </div>

            </div>
        </div>
    )

}
export default App;
