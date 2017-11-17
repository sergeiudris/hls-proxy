import * as React from 'react'
import styled from 'src/styled-components'

import { Box } from 'src/comps/grid'

interface IProps {

}

interface IState {


}


export class AppContent extends React.Component<IProps, IState> {



  render() {

    return (
      <Box flexcol>
          {this.props.children}
      </Box>
    )

  }


}
