import {
  coinbaseHooks,
  coinbaseWallet,
  metaMask,
  metamaskHooks,
  network,
  networkHooks,
  walletConnect,
  walletConnectHooks
} from './web3/connectors'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { Network } from '@web3-react/network'
import { Web3ReactHooks } from '@web3-react/core'

export const connectors: Array<[
  MetaMask | WalletConnect | CoinbaseWallet | Network,
  Web3ReactHooks
]> = [
  [metaMask, metamaskHooks],
  [walletConnect, walletConnectHooks],
  [coinbaseWallet, coinbaseHooks],
  [network, networkHooks]
]
