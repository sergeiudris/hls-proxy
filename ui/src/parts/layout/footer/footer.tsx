import * as React from 'react'
import styled from 'src/styled-components'


interface IProps {

}
interface IState {

}

export class AppFooter extends React.Component<IProps, IState> {

  render() {
    return (
      <Footer>

      </Footer>
    )
  }
}


const Footer = styled.footer`

  display: flex;
  background-color: ${p => p.theme.primaryColor};
  ${p => p.theme.bordered};

`
