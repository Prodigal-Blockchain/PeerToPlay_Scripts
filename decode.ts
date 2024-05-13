import { Interface, defaultAbiCoder } from '@ethersproject/abi'
import { isAddress } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'
import { AbiFetcher } from '../abi'
import { JsonRpcRetryProvider } from '../providers'
import { Network } from '../types'
import { ICastDecoderOptions } from './types'

const connectorsV1AddressToName: Record<Lowercase<string>, string> = {
  '0xe5398f279175962e56fe4c5e0b62dc7208ef36c6': 'basic',
  '0xd1aff9f2acf800c876c409100d6f39aea93fc3d9': 'authority',
  
}

const connectorsV2AddressToName: Record<Lowercase<string>, string> = {
  // '0x1d2663d4e2a58323ae63cc571375934ad9c993eC': '1INCH-A',
  '0x1d2663d4e2a58323ae63cc571375934ad9c993ec': '1INCH-V5-A',
  '0x16ac1e894abb854519243e9ff982673ab5497549': '1INCH-V4-A',
}


const LSA_V1_CAST_ABI = ['function cast(string[] calldata _targetNames, bytes[] calldata _datas, address _origin)']

const lsaV1Interface = new Interface(LSA_V1_CAST_ABI)
const DEFAULTS: ICastDecoderOptions = {
  instaConnectorsAddresses: {
    polygon: '0x2A00684bFAb9717C21271E0751BCcb7d2D763c88',
    mainnet: '0x97b0B3A8bDeFE8cB9563a3c610019Ad10DB8aD11',
    avalanche: '0x127d8cD0E2b2E0366D522DeA53A787bfE9002C14',
    optimism: '0x127d8cD0E2b2E0366D522DeA53A787bfE9002C14',
    arbitrum: '0x67fCE99Dd6d8d659eea2a1ac1b8881c57eb6592B',
    fantom: '0x819910794a030403F69247E1e5C0bBfF1593B968'
  }
}

type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any

const connectorAddressToName = (connectorAddressOrName: string, network: Network) => {
  if (!isAddress(connectorAddressOrName)) {
    return connectorAddressOrName
  }
  const address = connectorAddressOrName.toLowerCase()

  return connectorsV2AddressToName[address] || connectorsV1AddressToName[address] || avocadoConnectorsAddressToName[network][address] || address
}

export class CastDecoder {
  options: ICastDecoderOptions

  constructor (options?: Partial<ICastDecoderOptions>) {
    this.options = Object.assign({}, DEFAULTS, options)
    this.options.abiFetcher = this.options.abiFetcher || new AbiFetcher()
  }

  getEncodedSpells (data: string) {
    try {
      const isDsaV2 = data.startsWith('0x9304c934')
      const tx = (lsaV1Interface ).parseTransaction({ data })

      return {
        targets: isDsaV2 ? tx.args._targetNames : tx.args._targets,
        spells: tx.args._datas
      }
    } catch (error) {
      throw new Error("Can't decode spells")
    }
  }

  async getConnectorAbi (connectorName: string, network: Network = 'mainnet', metadata?: Record<string, any> & { blockNumber?: number | string }) {
    if (isAddress(connectorName)) {
      return await this.options.abiFetcher.get(connectorName, network, this.options.abiFetcher.options.proxyFetchMode, metadata)
    }

    const instaConnectorsAddress = this.options.instaConnectorsAddresses[network]

    const contract = new Contract(instaConnectorsAddress, [
      {
        inputs:
          [{ internalType: 'string', name: '', type: 'string' }],
        name: 'connectors',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function'
      }
    ], new JsonRpcRetryProvider(this.options.abiFetcher.options.rpcProviderUrl[network]))

    const contractAddress = await contract.connectors(connectorName, {
      blockTag: metadata && metadata.blockNumber ? metadata.blockNumber : 'latest'
    })

    return await this.options.abiFetcher.get(contractAddress, network, this.options.abiFetcher.options.proxyFetchMode, metadata)
  }

  async getSpell (connectorName: string, data: string, network: Network = 'mainnet', metadata?: Record<string, any> & { blockNumber?: number | string }) {
    const spell = {
      connector: connectorAddressToName(connectorName, network),
      data,
      method: null,
      args: [],
      namedArgs: {},
      flashloanSpells: undefined,
      isAvocadoFlashloan: false
    }

    const abi = await this.getConnectorAbi(connectorName, network, metadata)

    const connector = new Interface(abi)

    const tx = connector.parseTransaction({ data: spell.data })

    spell.method = tx.name
    spell.args = [...tx.args].map((arg) => {
      if (Array.isArray(arg)) {
        return arg.map(String)
      }

      return String(arg)
    })
    spell.namedArgs = Object.keys({ ...tx.args }).reduce((acc, key) => {
      if (isNaN(Number(key))) {
        const arg = tx.args[key]
        acc[key] = Array.isArray(arg) ? arg.map(String) : String(arg)
      }
      return acc
    }, {})

    if (spell.connector === 'INSTAPOOL-C' && ['flashBorrowAndCast', 'flashMultiBorrowAndCast'].includes(spell.method)) {
      try {
        const [targets, spells] = defaultAbiCoder.decode(['string[]', 'bytes[]'], (spell.namedArgs as any).data)
        spell.flashloanSpells = await this.getSpells({
          targets,
          spells
        }, network, metadata)
      } catch (error) {
        try {
          const [actions] = defaultAbiCoder.decode(['(address target, bytes data, uint256 value, uint256 operation)[]'], (spell.namedArgs as any).data)
          const targets = []
          const spells = []
          for (let index = 0; index < actions.length; index++) {
            const action = actions[index]

            if (action.target.toLowerCase() === '0x60d0DfAa7D6389C7a90C8FD2efAbB3162047adcd'.toLowerCase() && action.data.startsWith('0xc4cf3764')) {
              const decodedData = defaultAbiCoder.decode(['address[]', 'uint256[]'], `0x${data.slice(10)}`)

              const params = [
                ...decodedData,
                Array(decodedData[0].length).fill('0'),
                Array(decodedData[0].length).fill('0')
              ]

              const encodedData = defaultAbiCoder.encode(['address[]', 'uint256[]', 'uint256[]', 'uint256[]'], params)
              const encodedFunctionData = `0xf13fa6be${encodedData.slice(2)}`

              spells.push(encodedFunctionData)
              targets.push('INSTAPOOL-C')
            } else {
              spells.push(action.data)
              targets.push(connectorAddressToName(action.target, network))
            }
          }

          spell.flashloanSpells = await this.getSpells({
            targets,
            spells
          }, network, metadata)

          spell.isAvocadoFlashloan = true
        } catch (error) {
        }
      }
    }

    return spell
  }

  async getSpells (data: string | { targets: string[], spells: string[] }, network: Network = 'mainnet', metadata?: Record<string, any>) {
    const encodedSpells = typeof data === 'string' ? this.getEncodedSpells(data) : data

    const spells: AsyncReturnType<typeof this.getSpell>[] = []
    for (let index = 0; index < encodedSpells.targets.length; index++) {
      const spell = await this.getSpell(encodedSpells.targets[index], encodedSpells.spells[index], network, metadata)

      spells.push(spell)
    }

    return spells
  }

  async getEventNamedArgs (connectorName: string, eventName: string, eventParam: string, network: Network = 'mainnet', metadata?: Record<string, any> & { blockNumber?: number | string }) {
    const abi = await this.getConnectorAbi(connectorName, network, metadata)

    const connector = new Interface(abi.map(item => ({
      ...item,
      inputs: item.inputs
        ? item.inputs.map(input => ({
          ...input,
          indexed: false
        }))
        : []
    })))

    const log = connector.decodeEventLog(eventName, eventParam)

    return Object.keys(log).reduce((acc, key) => {
      if (isNaN(Number(key))) {
        acc[key] = String(log[key])
      }
      return acc
    }, {})
  }
}
