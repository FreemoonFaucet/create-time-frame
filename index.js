
const commander = require("commander")
const dotenv = require("dotenv")
const { ethers } = require("ethers")

const { frc759Abi } = require("./frc759Abi.js")

const program = new commander.Command()

const myParseInt = (value) => {
    const parsedValue = parseInt(value, 10)
  if(isNaN(parsedValue) || parsedValue < 0) throw new commander.InvalidArgumentError("Not anumber.")
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
    .command("createTf")
    .argument("<tokenAddress>", "address of token")
    .argument("<amount>", "amount (ether) of token to slice", myParseFloat)
    .argument("<sliceTime>", "timestamp of slice in seconds", myParseInt)
    .argument("[gasPrice]", "gas price in gwei", myParseFloat, 2)
    .description("Create a Time Frame of a given token")
    .action(async (tokenAddress, amount, sliceTime, gasPrice) => {
        const sliceDate = new Date(sliceTime*1000)
        console.log(`\nCreating a TF of ${ tokenAddress }, adding amount ${ amount }, slice date ${ sliceDate }, gas price ${ gasPrice } gwei.\n\n`)

        const provider = getProvider()
        const signer = getSigner(provider)

        const amountWei = ethers.utils.parseUnits(String(amount), "ether")
        const gasPriceWei = ethers.utils.parseUnits(String(gasPrice), "gwei")
        const token = new ethers.Contract(tokenAddress, frc759Abi, signer)

        console.log(ethers.utils.formatUnits(amountWei, "ether"))
        console.log(ethers.utils.formatUnits(gasPriceWei, "gwei"))

        try {
            const receipt = await token.sliceByTime(amountWei, sliceTime)
            const result = await receipt.wait()
            console.log(result)
        } catch(err) {
            console.log(err.message)
        }
    })

// get TF
program
    .command("getTf")
    .argument("<tokenAddress>", "address of token")
    .argument("<sliceTime>", "timestamp of slice in seconds", myParseInt)
    .description("Get a time frame address of a token")
    .action(async (tokenAddress, sliceTime) => {
        console.log(`\nGetting front/back end slices for token ${ tokenAddress }, timestamp ${ sliceTime } ...`)
        const MIN_TIME = 0
        const MAX_TIME = new ethers.BigNumber.from("18446744073709551615")
        const provider = getProvider()
        const token = new ethers.Contract(tokenAddress, frc759Abi, provider)
        const frontEndSlice = await token.getSlice(MIN_TIME, sliceTime)
        const backEndSlice = await token.getSlice(sliceTime, MAX_TIME)

        console.log(`\nFront end: ${ frontEndSlice }\nBack end: ${ backEndSlice }`)
    })
    

dotenv.config()
program.parse(process.argv)
