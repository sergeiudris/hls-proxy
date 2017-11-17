import * as React from 'react'
import styled from 'src/styled-components'
import { HashRouter, BrowserRouter, Router, Route, NavLink, Link, Redirect, withRouter, Switch } from 'react-router-dom'
import { AppBar, Toolbar, IconButton, Typography, Button, withStyles, WithStyles, Grid } from 'material-ui'
import MenuIcon from 'material-ui-icons/Menu'
import Dns from 'material-ui-icons/Dns'
import Dashboard from 'material-ui-icons/Dashboard'

import VideoCall from 'material-ui-icons/VideoCall'
import Settings from 'material-ui-icons/Settings'
import Home from 'material-ui-icons/Home'





interface IProps {

}
interface IState {

}

const decorate = withStyles(({ palette, spacing }) => ({
  root: {
    padding: spacing.unit,
    // background: palette.background,
    color: palette.primary,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
}));

// const styles = theme => ({
//   root: {
//     marginTop: theme.spacing.unit * 3,
//     width: '100%',
//   },
//   flex: {
//     flex: 1,
//   },
//   menuButton: {
//     marginLeft: -12,
//     marginRight: 20,
//   },
// });

export const AppHeader = decorate(
  class extends React.Component<IProps & WithStyles<"root" | "flex" | "menuButton">, IState> {

    render() {
      const { classes } = this.props
      return (
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar >
              <Grid container spacing={24} alignItems="center">
                <Grid item xs={1}>
                  {/* <IconButton className={classes.menuButton} color="contrast" aria-label="Menu">
                    <MenuIcon />
                  </IconButton> */}
                </Grid>
                <Grid item xs={1}>
                  <NavLink to="/">
                    {/* <Typography type="title" color="inherit" className={classes.flex}>
                  streaming
                </Typography> */}
                    <Home />
                  </NavLink>
                </Grid>
                <Grid item xs={1}>
                  <NavLink to="/stream-board">
                    <Dashboard />
                  </NavLink>
                </Grid>
                <Grid item xs={1}>
                  <NavLink to="/ffmpeg-board">
                    <VideoCall />
                  </NavLink>
                </Grid>
                <Grid item xs={1}>
                  <NavLink to="/stream-list">
                    <Dns />
                  </NavLink>
                </Grid>
                <Grid item xs={1}>
                  <NavLink to="/settings">
                    <Settings />
                  </NavLink>
                </Grid>
              </Grid>
              <Button color="contrast">Login</Button>
            </Toolbar>
          </AppBar>
        </div>
      )
    }
  }
)

const Header = styled.header`
  color: tan;
  font-size: 3em;
  display: flex;
  background-color: ${p => p.theme.primaryColor};
  height: 3rem;
  width: 100%;
  ${p => p.theme.bordered};

`
