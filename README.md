# create-time-frame

### Quick Start Guide

1. Make sure you have node, npm, git installed.

2. Clone repository ```git clone https://github.com/FreemoonFaucet/create-token-slice.git```

3. Install dependencies ```npm i```

4. To add your private key and RPC gateway to the session, run ```. start.sh``` and follow the instructions. You may need to allow execution first, using ```sudo chmod +x start.sh```.

5. To create a slice, (default to end of 2022) run the following command:

```node index.js createTf "0x466f16541685d5648184467f8f83835cbb837972" 1000 4```

- The above will create a TF of FREE, simultaneously burning 1000 full tokens and minting 1000 front end and back end tokens, at a gas price of 4.

6. To view a slice, (default to end of 2022) run the following command:

```node index.js getTf "0x466f16541685d5648184467f8f83835cbb837972"```

- The above displays both the front end address and the back end address for FREE TF at the end of 2022.