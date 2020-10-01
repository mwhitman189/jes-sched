import React from 'react'
import ReactSelect from 'react-select'
import styled from 'styled-components'

export const StyledSelect = styled(ReactSelect)`
  height: 30px;
  & > div {
    color: ${({ theme }) => theme.colors.primaryText};
    border-radius: 4px;
    background-color: #fff;
    width: 100%;
    border: ${({ theme }) => theme.colors.secondaryBackground} solid 2px;
    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      width: 160px;
    }
  }
`
