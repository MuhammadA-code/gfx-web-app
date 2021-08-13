import React from 'react'
import { Upload, message } from 'antd'

import styled from 'styled-components'
import { MainText } from '../../../styles'
import { ButtonWrapper } from '../NFTButton'

const { Dragger } = Upload

const DROP_CONTAINER = styled.div`
  border-radius: 20px;
  border: solid 2px #848484;
  border-style: dashed;
  background-color: #131313;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: ${({ theme }) => theme.margin(6)};
  padding-bottom: ${({ theme }) => theme.margin(6)};
  margin-top: ${({ theme }) => theme.margin(3)};
  margin-bottom: ${({ theme }) => theme.margin(3)};
`

const UploadZone = () => {
  /* const onDrop = React.useCallback((acceptedFiles) => {
    // Do something with the files
  }, []) */

  const TITLE_UPLOAD = MainText(styled.div`
    font-size: 17px;
    color: ${({ theme }) => theme.text1};
  `)

  const ButtonUpload = styled(ButtonWrapper)`
    background-color: ${({ theme }) => theme.primary2};
    padding: ${({ theme }) => `${theme.margin(1)} ${theme.margin(4)} `};
  `

  const DESC_UPLOAD = MainText(styled.div`
    font-size: 11px;
    color: ${({ theme }) => theme.text1};
    margin-top: ${({ theme }) => theme.margin(1)};
    margin-bottom: ${({ theme }) => theme.margin(2.5)};
  `)

  const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    }
  }

  return (
    <Dragger {...props}>
      <DROP_CONTAINER>
        <TITLE_UPLOAD>PNG, GIF, MP4 or AVI</TITLE_UPLOAD>
        <DESC_UPLOAD>Max 20Mb</DESC_UPLOAD>
        <ButtonUpload>
          <span>Choose file</span>
        </ButtonUpload>
      </DROP_CONTAINER>
    </Dragger>
  )
}

export default UploadZone
