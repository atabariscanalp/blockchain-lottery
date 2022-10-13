import { useWeb3React } from '@web3-react/core'
import { formatEther } from 'ethers/lib/utils'

export const useBalance = async () => {
  const { account, provider } = useWeb3React()

  if ((provider != null) && account) {
    const balance = await provider.getBalance(account)
    return {
      balance: formatEther(balance)
    }
  }
}
