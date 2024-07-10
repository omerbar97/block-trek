#!/bin/bash

# Open a new Terminal window and run the hardhat node, keeping the terminal open
osascript <<EOF
tell application "Terminal"
    do script "cd $(pwd)/web3-hardhat && npx hardhat node; exec bash"
end tell
EOF

# Open a new Terminal window and run the hardhat deploy script, allowing it to finish and then close
osascript <<EOF
tell application "Terminal"
    do script "cd $(pwd)/web3-hardhat && npx hardhat run --network localhost scripts/deploy.ts"
end tell
EOF

# Open a new Terminal window and run the development server, keeping the terminal open
osascript <<EOF
tell application "Terminal"
    do script "cd $(pwd)/dapp && npm run dev; exec bash"
end tell
EOF
