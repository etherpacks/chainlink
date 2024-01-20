const fs = require('fs')

const dpack   = require('@etherpacks/dpack')
const aggregator = require('@chainlink/contracts/abi/v0.8/AggregatorV3Interface.json')


let info = {
  arbitrum: {
    eth_usd: { address: '0x639fe6ab55c921f74e7fac1ee960c0b6293ba612' },
    weth_usd: { address: '0x639fe6ab55c921f74e7fac1ee960c0b6293ba612' },
    btc_usd: { address: '0x6ce185860a4963106506c203335a2910413708e9' },
    wsteth_eth: { address: '0xb523ae262d20a936bc152e6023996e46fdc2a95d' },
    reth_eth: { address: '0xf3272cafe65b190e76caaf483db13424a3e23dd2' },
    dai_usd: { address: '0xc5c8e77b397e531b8ec06bfb0048328b30e9ecfb' },
    xau_usd: { address: '0x1f954dc24a49708c26e0c1777f16750b5c6d5a2c' }
  },
  ethereum: {
    dai_usd: { address: '0xaed0c38402a5d19df6e4c03f4e2dced6e29c1ee9' },
    xau_usd: { address: '0x214ed9da11d2fbe465a6fc601a91e62ebec1a0d6' },
    eth_usd: { address: '0x214ed9da11d2fbe465a6fc601a91e62ebec1a0d6' },
    weth_usd: { address: '0x214ed9da11d2fbe465a6fc601a91e62ebec1a0d6' },
    wsteth_eth: { address: '0xb523ae262d20a936bc152e6023996e46fdc2a95d' }
  }

}

async function build(network) {
  const builder = new dpack.PackBuilder(network)
  const json = JSON.stringify

  const Aggregator_artifact = {
    abi: aggregator,
    bytecode: '0x'
  }

  fs.writeFileSync(`./link/AggregatorV3Interface.json`, json(Aggregator_artifact))
  await builder.packType({
    typename: 'AggregatorV3Interface',
    artifact: Aggregator_artifact
  }, false)

  for (let k of Object.keys(info[network])) {
    await builder.packObject({
      objectname: `agg_${k}`,
      address: info[network][k].address,
      typename: 'AggregatorV3Interface',
      artifact: Aggregator_artifact
    }, false)
  }

  const pack = await builder.build();
  fs.writeFileSync(`./pack/chainlink_${network}.dpack.json`, JSON.stringify(pack, null, 2));
}

build('arbitrum')
