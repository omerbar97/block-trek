# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

to run the hardhat on localhost run the following command
```shell
npx hardhat node
```

after it is running, to deploy the script, run this:
```shell
npx hardhat run --network <your-network> scripts/deploy.ts
```

for localhost:
```shell
npx hardhat run --network localhost scripts/deploy.ts
```

