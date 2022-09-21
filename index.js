
const commader = require("commander")
const dotenv = require("dotenv")
const { ethers } = require("ethers")

const frc759Abi = require("./frc759Abi.js")

const program = new commander.Command()

const myParseInt = (value) => {
    const parsedValue = parseInt(value, 10)
    if(isNaN(parsedValue) || parsedValue < 0) throw new commander.InvalidArgumentError("Not a number.")
    return parsedValue
}

const myParseFloat = (value) => {
    const parsedValue = parseFloat(value, 10)
    if(isNaN(parsedValue) || parsedValue < 0) throw new commander.InvalidArgumentError("Not a number.")
    return parsedValue
}

const getProvider = () => {
    return new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
}

const getSigner = (provider) => {
    const wallet = new ethers.Wallet(process.env.PK)
    const signer = wallet.connect(provider)
    return signer
}


program
    .version("1.0.0")
    .description("Create a Time Framed token from the command line")

// create TF
program
    .command("timeframe")
    .argument("<tokenAddress>", "address of token")
    .argument("<amount>", "amount (ether) of token to slice")
    .argument("<sliceTime>", "timestamp of slice in seconds")
    .argument("[gasPrice]", "gas price in gwei", myParseInt, 2)
    .description("Create a Time Frame of a given token")
    .action(async (tokenAddress, amount, sliceTime, gasPrice) => {
        const sliceDate = new Date(sliceTime*1000)
        console.log(`Creating a TF of ${ tokenAddress }, adding amount ${ amount }, slice time ${ sliceDate }, gas price ${ gasPrice } gwei.")

        const provider = getProvider()
        const signer = getSigner(provider)

        const amountWei = ether.utils.parseUnits(amount, "ether")
        const gasPriceWei = ether.utils.parseUnits(gasPrice, "gwei")
        const token = new ethers.Contract(tokenAddress, frc759Abi)

        console.log(ethers.utils.formatUnits(amountWei, "ether"))
        console.log(ethers.utils.formatUnits(gasPriceWei, "gwei"))

        try {
            // await token.sliceByTime(amountWei, sliceTime)
        } catch(err) {
            console.log(err.message)
        }
    })
