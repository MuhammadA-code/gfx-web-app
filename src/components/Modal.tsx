import React, { FC, ReactNode } from 'react'
import { Modal as AntModal } from 'antd'
import styled from 'styled-components'
import { useDarkMode } from '../context'
import { CenteredImg, SpaceBetweenDiv, SVGToWhite } from '../styles'

const CLOSE_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements('14px')}
  cursor: pointer;
`

const HEADER = styled(SpaceBetweenDiv)`
  width: 100%;
`

const TITLE = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.text1};
`

export const Modal: FC<{
  children: ReactNode
  large?: boolean
  setVisible: (x: boolean) => void
  onCancel?: () => void
  title: string
  visible: boolean
  [x: string]: any
}> = ({ children, onCancel, large = false, setVisible, title, visible, ...props }) => {
  const { mode } = useDarkMode()
  const handleCancel = () => {
    onCancel && onCancel()
    setVisible(false)
  }

  return (
    <AntModal
      bodyStyle={{
        backgroundColor: mode === 'dark' ? '#2a2a2a' : 'white',
        borderRadius: '20px',
        maxHeight: '80vh',
        overflowY: 'scroll',
        fontFamily: 'Montserrat'
      }}
      centered
      closable={false}
      footer={null}
      onCancel={handleCancel}
      maskClosable
      visible={visible}
      width={large ? '50vw' : 350}
      {...props}
    >
      <HEADER>
        <TITLE>{title}</TITLE>
        <CLOSE_ICON className="modal-close-icon" onClick={handleCancel}>
          {mode === 'dark' ? (
            <SVGToWhite src={`/img/assets/cross.svg`} alt="close" />
          ) : (
            <img src={`/img/assets/cross.svg`} alt="close" />
          )}
        </CLOSE_ICON>
      </HEADER>
      {children}
    </AntModal>
  )
}
