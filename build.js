const fs = require('fs')

const dpack   = require('@etherpacks/dpack')
const aggregator = require('@chainlink/contracts/abi/v0.8/AggregatorV3Interface.json')


let info = {
  arbitrum: {
    wsteth_eth: { address: '0xb523ae262d20a936bc152e6023996e46fdc2a95d' },
    reth_eth: { address: '0xF3272CAfe65b190e76caAF483db13424a3e23dD2' },
    dai_usd: { address: '0xc5c8e77b397e531b8ec06bfb0048328b30e9ecfb' },
    xau_usd: { address: '0x1f954dc24a49708c26e0c1777f16750b5c6d5a2c' },
    usdc_usd: { address: '0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3' },
    btc_usd: { address: '0x6ce185860a4963106506c203335a2910413708e9' },
    eth_usd: { address: '0x639fe6ab55c921f74e7fac1ee960c0b6293ba612' },
    arb_usd: { address: '0xb2A824043730FE05F3DA2efaFa1CBbe83fa548D6' },
    link_usd: { address: '0x86E53CF1B870786351Da77A57575e79CB55812CB' },
    gns_usd: { address: '0xE89E98CE4E19071E59Ed4780E0598b541CE76486' },
    gmx_usd: { address: '0xDB98056FecFff59D032aB628337A4887110df3dB' }
  },

  ethereum: {
    dai_usd: { address: '0xaed0c38402a5d19df6e4c03f4e2dced6e29c1ee9' },
    reth_eth: { address: '0x536218f9E9Eb48863970252233c8F271f554C2d0' },
    btc_usd: { address: '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c' },
    xau_usd: { address: '0x214ed9da11d2fbe465a6fc601a91e62ebec1a0d6' },
    usdc_usd: { address: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6' },
    usdc_eth: { address: '0x986b5E1e1755e3C2440e960477f25201B0a8bbD4' },
    eth_usd: { address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419' },
    link_usd: { address: '0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c' },
    link_eth: { address: '0xDC530D9457755926550b59e8ECcdaE7624181557' },
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

  const cid = await dpack.putIpfsJson(pack, true)
  console.log(`  ${network} pack @ ${cid}`)
  fs.writeFileSync(`./pack/chainlink_${network}.dpack.json`, JSON.stringify(pack, null, 2));
}

build('arbitrum')
build('ethereum')
