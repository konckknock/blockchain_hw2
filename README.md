# ZJU-blockchain-course-2023

## 如何运行

补充如何完整运行你的应用。

1. 在本地启动ganache应用。

2. 在 `./contracts` 中安装需要的依赖，运行如下的命令：
    ```bash
    npm install
    ```
    
3. 在`./contracts/contracts/BorrowYourCar.sol`中的mint函数中设置每个人初始拥有的汽车id。
   
3. 在 `./contracts` 中编译合约，运行如下的命令：
   
    ```bash
    npx hardhat compile
    ```
    
5. 在./`hardhat.config.ts`中修改account为自己部署的链中的地址

6. 在`./frontend/src/utils/address.json`中修改地址为自己合约中的地址

6. 在 `./frontend` 中安装需要的依赖，运行如下的命令：
    ```bash
    npm install
    ```
    
7. 在`./frontend/src/App.tsx`中的数组中设置每个人初始拥有的汽车id和拥有者，以便正确展示
   
7. 在 `./frontend` 中启动前端程序，运行如下的命令：
   
    ```bash
    npm run start
    ```

## 功能实现分析



1. 显示用户拥有的车辆和当前可租用的车辆

![image-20231112001115008](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20231112001115008.png)

当前用户和租有的车辆是常量，所以在前端中用常量数组直接显示，可被借用的汽车列表是通过后端遍历来获得

![image-20231112001319517](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20231112001319517.png)

调用了userof函数，如果有租用者且尚未过期，则添加到可用汽车列表。

2. 查询一辆汽车的主人及其借用者

   主人通过前端静态数组查询，借用者则通过后端userof函数调用加前端useeffect渲染实时更新。

   ![image-20231112001615230](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20231112001615230.png)

   3. 借车

      通过输入车的编号和借用天数，可以借用汽车一段时间。通过模仿ERC4907实现

      ![image-20231112001756144](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20231112001756144.png)

![image-20231112001813359](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20231112001813359.png)

## 项目运行截图

合约成功部署

![image-20231112001859252](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20231112001859252.png)

初始默认五辆车，均可用

![image-20231112001937159](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20231112001937159.png)

输入车的编号和借车事件后，即可借车

![image-20231112001959103](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20231112001959103.png)

随后观察到汽车借用成功，借用者和可用车辆均发生改变

![image-20231112002058426](C:\Users\86152\AppData\Roaming\Typora\typora-user-images\image-20231112002058426.png)

## 参考内容

- 课程的参考Demo见：[DEMOs](https://github.com/LBruyne/blockchain-course-demos)。

- ERC-4907 [参考实现](https://eips.ethereum.org/EIPS/eip-4907)

