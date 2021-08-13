import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { Tooltip } from '../../../components'
import { useAccounts, useSynths } from '../../../context'
import { monetaryFormatValue } from '../../../utils'

const TITLE = styled.div`
  display: flex;
  align-items: center;

  > span {
    margin-right: ${({ theme }) => theme.margin(2)};
    font-weight: bold;
    color: ${({ theme }) => theme.text1};
  }
`

const WRAPPER = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  justify-content: flex-start;
  padding: ${({ theme }) => theme.margin(4)} ${({ theme }) => theme.margin(3)};

  > span {
    text-align: left;

    &:nth-child(2) {
      margin: ${({ theme }) => theme.margin(1.5)} 0 ${({ theme }) => theme.margin(0.5)};
      font-weight: bold;
      color: ${({ theme }) => theme.text1};
    }

    &:last-child {
      font-size: 12px;
      color: ${({ theme }) => theme.text4};
    }
  }
`

export const Header: FC = () => {
  const { balances } = useAccounts()
  const { availableSynths, prices, userPortfolio } = useSynths()

  const value = useMemo(() => {
    const synthsValue = availableSynths.reduce((acc, [synth, { address }]) => {
      return acc + balances[address.toString()]?.uiAmount * prices[synth]?.current
    }, 0)

    return (synthsValue || 0) + userPortfolio.cValue - userPortfolio.debt
  }, [availableSynths, balances, prices, userPortfolio.cValue, userPortfolio.debt])

  return (
    <WRAPPER>
      <TITLE>
        <span>Portfolio Overview</span>
        <Tooltip>The current gUSD denominated value of your portfolio.</Tooltip>
      </TITLE>
      <span>{monetaryFormatValue(value)} gUSD</span>
      {/* <span>30/12/16</span> */}
    </WRAPPER>
  )
}
