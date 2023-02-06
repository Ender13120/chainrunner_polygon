const ethers = require('ethers');
const contractABI = require('./abi/contractOptions.json');
var moment = require('moment');

const privateKeyResolverWallet =
  '587551309017b901fc869c3197ad584c150c379d1e4eb1ae4678400311f39bc2'; //resolver private key 0x420698c552B575ca34F0593915C3A25f77d45b1e
const optionMakerAddress = '0x48aA03f6959B390b7381258B4d4658c3bA28F402'; // deployed on Goerli https://goerli.etherscan.io/tx/0x2413ca7fbf036bc1720e745cc457f10e54bedbb097fa1f0180f91fff3a027774 , the MockChainlink Contract is here: 0x034F2145c00098C30d57800EFBd645401dda4ca6 , deployed on Goerli : https://goerli.etherscan.io/tx/0x66654645f9ec0cdb4b54bff0d15c70ff4f8638779bb4f2e0713b2d2b328612e2
const blockTimer = 90000;
let currNonce = 1;

const provider = new ethers.providers.JsonRpcProvider(
  'https://special-sparkling-bush.avalanche-mainnet.discover.quiknode.pro/54b5f43f34068b154b3adbf8bc967c9eca870dc2/',
);

const wallet = new ethers.Wallet(privateKeyResolverWallet, provider);

const main = async () => {
  const deployedContractOptions = new ethers.Contract(
    optionMakerAddress,
    contractABI,
    provider,
  );

  function startResolvementBet(timeToResolveBet, betId) {
    let currentTimeStamp = moment().unix();
    console.log('starting resolvement process' + currentTimeStamp);
    let timeToResolveBetClean = timeToResolveBet._hex;
    timeToResolveBetClean = ethers.utils.hexlify(timeToResolveBetClean);
    timeToResolveBetClean = Number(timeToResolveBetClean);

    console.log('betId OG');
    console.log(betId);
    betId = betId._hex;
    betId = ethers.utils.hexlify(betId);
    betId = Number(betId);

    console.log('betId after');
    console.log(betId);

    console.log('bet was found! Will be resolved!');

    console.log('passed from event: ');
    console.log(timeToResolveBetClean);

    let amountToWait = timeToResolveBetClean + 120 - currentTimeStamp;
    amountToWait = amountToWait;
    console.log(timeToResolveBetClean);
    console.log(currentTimeStamp);
    console.log(amountToWait);

    amountToWait = amountToWait * 1000;

    //unix is in seconds, while JS uses miliseconds, so multiply by a thousand. This doesnt block the server!
    setTimeout(function () {
      resolveBet(betId);
    }, amountToWait);
  }

  async function resolveBet(betId) {
    console.log('starting tx  process');
    const resolveBet = await deployedContractOptions
      .connect(wallet)
      .resolveBet(betId);

    resolveBet.wait();

    console.log('bet was resolved!');
    currNonce -= 1;
  }

  //const tx = startResolvementBet({ _hex: '0x630BC7DB', _isBigNumber: true }, 0);
  //making sure I am not running out of testfunds..
  const balance = await provider.getBalance(optionMakerAddress);
  console.log(
    `\nETH Balance of ${optionMakerAddress} --> ${ethers.utils.formatEther(
      balance,
    )} ETH\n`,
  );

  console.log('started listening');
  deployedContractOptions.on(
    'betAccepted',
    (from, timeAccepted, timeToResolveBet, betId, stockPicked) => {
      let betInfo = {
        from: from,
        timeAccepted: timeAccepted,
        timeToResolveBet: timeToResolveBet,
        betId: betId,
        stockPicked: stockPicked,
      };
      console.log('bet accepted event found!');

      //const tx = startResolvementBet(betInfo.timeToResolveBet, betInfo.betId)
      currNonce += 1;
      setTimeout(function () {
        startResolvementBet(betInfo.timeToResolveBet, betInfo.betId);
      }, 30000 + blockTimer * currNonce);
    },
  );
};

main();
