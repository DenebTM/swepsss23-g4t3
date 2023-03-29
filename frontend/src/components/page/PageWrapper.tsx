import React from 'react'

import LinearProgress from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'

const WrapperDiv = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  overflow: 'auto',
  margin: '0 auto',
  flexDirection: 'column',
})

interface PageWrapperProps {
  children: React.ReactNode
  pending?: boolean
}

/**
 * Wrapper component with page padding.
 * Renders page contents wrapped with padding. Shows a loading indicator if pending is set to true.
 */
export const PageWrapper: React.FC<PageWrapperProps> = (props) => {
  return (
    <WrapperDiv>
      {Boolean(props.pending) && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <LinearProgress sx={{ height: 4.5 }} />
        </div>
      )}
      {props.children}
    </WrapperDiv>
  )
}
