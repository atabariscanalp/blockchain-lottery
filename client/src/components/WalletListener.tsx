import React, { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useModalContext } from '../utils/context'
import { formatEther } from 'ethers/lib/utils'

export const WalletListener: React.FC = ({ children }) => {
  const {
    provider,
    isActive,
    account
  } = useWeb3React()

  const { setIsOpen } = useModalContext()

  if (account) {
    provider
      ?.getBalance(account)
      .then((b) => console.log('balance', formatEther(b)))
  }

  useEffect(() => {
    setIsOpen(false)
  }, [isActive, setIsOpen])

  return <>{children}</>
}
