import React, { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { PublicKey } from '@solana/web3.js'
import { AvailableSynth, AvailableSynthsSelector } from '../shared'
import { SynthToken } from '../../SynthToken'
import { ArrowDropdown } from '../../../../components'
import { ISwapToken, useAccounts, useSynthSwap } from '../../../../context'
import { CenteredImg, FlexColumnDiv, SpaceBetweenDiv } from '../../../../styles'

const WRAPPER = styled(FlexColumnDiv)<{ $height: string }>`
  position: absolute;
  top: 0;
  left: 0;
  align-items: flex-start;
  height: ${({ $height }) => $height};
  width: 48%;
  padding: 10px ${({ theme }) => theme.margin(2)} ${({ theme }) => theme.margin(1.5)};
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => theme.grey5};
  z-index: 1;
  cursor: pointer;
  > div {
    ${({ theme }) => theme.measurements('100%')}
    > span {
      font-size: 10px;
      font-weight: bold;
    }
  }
  > span {
    font-size: 8px;
    whitespace: no-wrap;
  }
`

const Overlay: FC<{
  otherToken?: ISwapToken
  setArrowRotation: Dispatch<SetStateAction<boolean>>
  setVisible: Dispatch<SetStateAction<boolean>>
  side: 'in' | 'out'
}> = ({ otherToken, setArrowRotation, setVisible, side }) => {
  const { getUIAmount } = useAccounts()
  const { availableSynths, prices, setInToken, setOutToken } = useSynthSwap()

  const handleClick = useCallback(
    ([symbol, { address, decimals }]) => {
      setArrowRotation(false)
      side === 'in' ? setInToken({ address, decimals, symbol }) : setOutToken({ address, decimals, symbol })
      setVisible(false)
    },
    [setArrowRotation, setInToken, setOutToken, setVisible, side]
  )

  const synths = useMemo(() => {
    const synths: [string, { address: PublicKey; balance: number; decimals: number; value: number }][] = availableSynths
      .filter(([name]) => name !== otherToken?.symbol && name !== 'GOFX')
      .map(([synth, { address, decimals }]) => {
        const balance = getUIAmount(address.toString())
        const value = balance * prices[synth]?.current

        return [
          synth,
          {
            address,
            balance,
            decimals,
            value
          }
        ]
      })

    synths.sort(([a, { value: va }], [b, { value: vb }]) => vb - va || a.localeCompare(b))
    return synths
  }, [availableSynths, getUIAmount, otherToken?.symbol, prices])

  return (
    <AvailableSynthsSelector>
      {synths.map((synth, index) => (
        <AvailableSynth key={index} onClick={() => handleClick(synth)}>
          <CenteredImg>
            <img src={`/img/synth/${synth[0]}.svg`} alt="" />
          </CenteredImg>
          <span>{synth[0]}</span>
          <span>{synth[1].balance.toFixed(2)}</span>
        </AvailableSynth>
      ))}
    </AvailableSynthsSelector>
  )
}

export const Selector: FC<{
  balance: number
  height: string
  otherToken?: ISwapToken
  side: 'in' | 'out'
  token?: ISwapToken
}> = ({ balance, height, otherToken, side, token }) => {
  const [arrowRotation, setArrowRotation] = useState(false)
  const [visible, setVisible] = useState(false)

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setVisible(!visible)
  }

  return (
    <WRAPPER $height={height} onClick={handleClick}>
      <SpaceBetweenDiv>
        {token ? <SynthToken size="medium" synth={token.symbol} /> : <span>Select a token</span>}
        <ArrowDropdown
          arrowRotation={arrowRotation}
          measurements="12px"
          offset={[125, 33]}
          onVisibleChange={handleClick}
          onClick={handleClick}
          overlay={
            <Overlay otherToken={otherToken} setArrowRotation={setArrowRotation} setVisible={setVisible} side={side} />
          }
          visible={visible}
        />
      </SpaceBetweenDiv>
      {balance > 0 && <span>Balance: {balance.toFixed(3)}</span>}
    </WRAPPER>
  )
}
