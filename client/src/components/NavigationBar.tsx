import React from 'react'
import { Button } from './Button'
import { MemoizedLogo as Logo } from './Logo'
import { DownArrowIcon, WalletIcon } from '../icons/Icons.svg'
import { useModalContext } from '../utils/context'
import { useWeb3React } from '@web3-react/core'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { walletAddressParser } from '../utils/web3/web3.util'

const NavigationBar = () => {
  const { setIsOpen } = useModalContext()
  const { account, connector } = useWeb3React()

  const onClick = () => {
    setIsOpen(true)
  }

  const onDisconnect = () => {
    if (connector.deactivate != null) {
      connector.deactivate()
    }
  }

  const getButton = () =>
    account
      ? (
      <Button
        size={'large'}
        color={'outline'}
        icon={
          <Jazzicon
            diameter={20}
            seed={jsNumberForAddress(account)}
            paperStyles={{ marginRight: 12 }}
          />
        }
        rightIcon={
          <DownArrowIcon width={20} height={20} style={{ marginLeft: 4 }} />
        }
        classNameOverride={'font-medium'}
        onClick={onDisconnect}
      >
        {walletAddressParser(account)}
      </Button>
        )
      : (
      <Button
        size={'large'}
        color={'outline'}
        icon={<WalletIcon width={20} height={20} style={{ marginRight: 12 }} />}
        onClick={onClick}
      >
        Connect Wallet
      </Button>
        )

  return (
    <header className="py-6 flex justify-between w-full">
      <Logo />
      {getButton()}
    </header>
  )
}

export const MemoizedNavigationBar = React.memo(NavigationBar)
