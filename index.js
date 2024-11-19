(global).WebSocket = require('ws');
const jackaljs = require('@jackallabs/jackal.js')

const ClientHandler = jackaljs.ClientHandler
const express = require('express')
const app = express()
const port = 3088
const mainnetChainID = 'jackal-1'

const mainnet = {
    chainConfig: {
        chainId: mainnetChainID,
        chainName: 'Jackal Main Net',
        rpc: 'https://internalrpc.jackalprotocol.com',
        rest: 'https://internalapi.jackalprotocol.com',
        bip44: {
            coinType: 118
        },
        stakeCurrency: {
            coinDenom: 'JKL',
            coinMinimalDenom: 'ujkl',
            coinDecimals: 6
        },
        bech32Config: {
            bech32PrefixAccAddr: 'jkl',
            bech32PrefixAccPub: 'jklpub',
            bech32PrefixValAddr: 'jklvaloper',
            bech32PrefixValPub: 'jklvaloperpub',
            bech32PrefixConsAddr: 'jklvalcons',
            bech32PrefixConsPub: 'jklvalconspub'
        },
        currencies: [
            {
                coinDenom: 'JKL',
                coinMinimalDenom: 'ujkl',
                coinDecimals: 6
            }
        ],
        feeCurrencies: [
            {
                coinDenom: 'JKL',
                coinMinimalDenom: 'ujkl',
                coinDecimals: 6,
                gasPriceStep: {
                    low: 0.002,
                    average: 0.002,
                    high: 0.02
                }
            }
        ],
        features: []
    },
    chainId: mainnetChainID,
    endpoint: 'https://internalrpc.jackalprotocol.com',
    options: {},
    networks: ['jackal']
}

let details = {
    ...mainnet,
    selectedWallet: "mnemonic",
    mnemonic: "faculty when fade marble direct short upon program tooth height provide you"
}

let jackalClient = {};
let storage = {};

async function init() {
    try {
        jackalClient = await ClientHandler.connect(details)
        storage = await jackalClient.createStorageHandler()
    } catch (e) {
        throw (e)
    }
}


app.get('/:address/:ulid', async (req, res) => {
    const address = req.params.address
    const ulid = req.params.ulid
    const key = req.query.key

    const downloadOptions = {
        ulid: ulid,
        linkKey: key,
        trackers: {
            chunks: [],
            progress: 0
        },
        userAddress: address
    }

    try {
        const file = await storage.downloadByUlid(downloadOptions)
        res.setHeader("Content-Disposition", `inline; filename="${file.name}"`);
        res.setHeader("Content-Type", file.type);
        res.send(Buffer.from(await file.arrayBuffer()));
    } catch (e) {
        res.status(404)
    }


})

app.get('/', (req, res) => {
    res.send('Hello Jackal!')
})

app.listen(port, () => {
    console.log(`Jackal sharing gateway now listening on ${port}`)
    init()
})
