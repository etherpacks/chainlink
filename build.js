const fs = require('fs')

const dpack   = require('@etherpacks/dpack')
const aggregator = require('@chainlink/contracts/abi/v0.8/AggregatorV3Interface.json')


let info = {
  arbitrum: {
    eth_usd: { address: '0x639fe6ab55c921f74e7fac1ee960c0b6293ba612' },
    btc_usd: { address: '0x6ce185860a4963106506c203335a2910413708e9' },
    wsteth_eth: { address: '0xb523ae262d20a936bc152e6023996e46fdc2a95d' },
    reth_eth: { address: '0xf3272cafe65b190e76caaf483db13424a3e23dd2' }
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
