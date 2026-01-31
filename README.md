# GreenLedger

This repository contains the code for an Agricultural Supply Chain Dapp With Micro-Finance functionality, coded using **Truffle** and **Solidity**. The backend blockchain is a private Ethereum network setup using **Geth(go-ethereum)** and the interactions are made possible by **Web3** javascript library.

## What problems are we solving?

An Agricultural Supply Chain tracks a farm product from the farmer to the consumer. Farmers in developing countries are heavily dependent on bank loans. Due to this heavy debt , farmers can't maintain a steady production of agriculture. Micro-finance can help these farmers out of debt.

### Agro-market

In the recent past, we have read many incidents regarding the farmer suicides due to debts and poor yield from farming. For a country like India, with the rise in population, dependency over the land for building houses and industrial areas is increasing rapidly. The fertile land for farming is dwindling and more yields have to be produced to satisfy the need of the country. Even though the demand increase, the farmers are suffering from some major issues like : 

i.	Raising the initial investment for setting up the field due to high bank interest rates.

ii.	Fetch reasonable prices for their produce due to the intervention of middlemen in market.

iii.	Analyzing market trends and customer needs. Currently the farmer and customer are completely separated in the market by the middlemen.

iv.	Inefficient supply chain and issues in storage and transportation, leading to deterioration of crops.

Similarly, the customers are also worried about the high price of commodities as well as the quality of produce. They are forced to purchase whatever is available in the market at the price set by the seller. The ill practices of Black marketing, hoarding, adulteration, etc., carried out by the middle man further increases the prices for the farm products. Even though the demand for organic products is increasing, there is lack of mechanism for tracing the stages of organic cultivation and ensure authenticity.
The biggest challenge in the agro-markets is the ‘disconnect’ between the farmers and the consumers.


## Our solution to the problem:

**GreenLedger**, is a  blockchain based transparent market place where the farmers and consumers could implement a co-operative farming method. Here, the farmers can list the potential crops and the expected yield on his farm on the distributed public ledger. The consumers can view the details and check for the farmer credibility based on the previous cultivation and supply. This creates a transparent and tamper-proof digital market platform for farm products. Thus an agreement (consensus) can be formed between farmer and consumer, such that the consumer can fund individual crops or a field and can acquire or the yield from the farm or the profit percentage of its market value. There will be a rating mechanism to build the credibility of farmer and consumer based on the previous experiences in the GreenLedger market.

## How to Run
Prerequisites: Node.js, Ganache (running on port 8545).

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Compile and Deploy Contracts**:
   ```bash
   truffle migrate --reset
   ```
3. **Run Application**:
   ```bash
   npm run dev
   ```
   The application will look for the deployed contracts automatically. No manual address copying is required.
   Access at `http://localhost:8080`.

## Building for Production
To build the application bundle manually:
```bash
npm run build
```


![Alt text](https://github.com/nikhilvc1990/AgriChain/blob/master/screenshots/Farmer%20Registration%20Page.PNG?raw=true "Farmer Registration")

The above figure shows the registration form for the farmer in the supply chain application. The entered details are stored directly onto the blockchain. The underlying technology uses Truffle for the deployment and go-ethereum(geth) as the backend blockchain. We use the Web3 Javascript provider API to interact with the blockchain.

![Alt text](https://github.com/nikhilvc1990/AgriChain/blob/master/screenshots/Quality.PNG?raw=true "Farmer Registration")

The next page is for quality testing, here we can get the farmer details by Farmer Id. These details are stored as a structure using solidity code onto the blockchain. The Farmer details are retrieved using a special data structure called mapping by Farmer Id. 

![Alt text](https://github.com/nikhilvc1990/AgriChain/blob/master/screenshots/View%20Blocks.PNG?raw=true "Quality Testing")
This is the Quality Testing page.
Here we can see the block details where the farmer’s details are stored onto blockchain. The ‘Approve Details’ will approve the details of the farmer.

![Alt text](https://github.com/nikhilvc1990/AgriChain/blob/master/screenshots/QualityTestingProduct.PNG?raw=true "Product Testing")

Approve Details button click will redirect to this Product details page. This is also part of the quality testing where we enter the lot number, grade, price, test date and expiry date. These details are also stored in the blockchain as a structure.

![Alt text](https://github.com/nikhilvc1990/AgriChain/blob/master/screenshots/CustomerDetails.PNG?raw=true "Customer Details")

This is the customer page where the customer can check the customer details and status of the quality testing of his agriculture produce. The customer has to enter the farmer id and Lot number to see the details. These customer details are retrieved from the blockchain.

![Alt text](https://github.com/nikhilvc1990/AgriChain/blob/master/screenshots/Micro-Finance.PNG?raw=true "Micro-Finance")

The micro-finance form enables any user to fund a farmer. The funding is done by providing the farmers public id, the lot number of the product and the amount.

# System Architecture


![Alt text](https://github.com/nikhilvc1990/AgriChain/blob/master/screenshots/AgriChain.jpg?raw=true "Flow Chart")



# About Us

We are a group of researchers based at Indian Institute Of Information Technology and Management - Kerala

Website/Contact : http://agrochain.in/

