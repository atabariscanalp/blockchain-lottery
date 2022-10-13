import React, { useEffect, useState } from 'react'
import { Query, sdk } from '../../api'
import { DownArrowLong, MaticIcon, UpArrowLong } from '../../icons/Icons.svg'
import { TokensList } from './tokens/TokensList'
import { useWeb3React } from '@web3-react/core'

export const TokensLostComponent: React.FC = () => {
  type returnType = Awaited<ReturnType<typeof sdk.User.getLostTokens>>
  const { fetch, data, error } = Query<returnType>(sdk.User.getLostTokens)

  const { account } = useWeb3React()

  useEffect(() => {
    if (account) {
      fetch({ userId: account })
    }
  }, [account])

  useEffect(() => {
    console.log('error', error)
  }, [error])

  return (
    <div
      className="bg-blue-fade rounded-lg flex flex-col px-4 pt-6 pb-3 items-center justify-between"
      style={{ width: '26%' }}
    >
      <div className="flex flex-col items-center">
        <div className="flex flex-row items-center mb-5">
          <DownArrowLong width={35} height={40} />
          <span className="text-honeydew text-2xl font-bold">LOST</span>
        </div>
        {(data != null)
          ? (
            <div className="flex flex-col items-center self-center justify-around">
              {Object.keys(data).map((k, v) => (
                <TokensList tokenType={k} value={data[k]} key={v}/>
              ))}
            </div>
            )
          : null
        }
      </div>
      <div className="flex flex-row items-center justify-around self-end justify-self-end w-1/2 px-1">
            <span className="text-grey-fade text-sm font-semibold cursor-pointer">
              TODAY
            </span>
        <span className="font-bold text-rich-black">|</span>
        <span className="text-honeydew text-sm font-bold cursor-pointer">
              ALL TIME
            </span>
      </div>
    </div>
  )
}
