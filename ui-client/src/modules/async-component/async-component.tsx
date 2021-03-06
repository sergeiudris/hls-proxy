import * as React from 'react'

export function asyncComponent(getComponent) {
  return class AsyncComponent extends React.Component<any, any> {
    static Component = null;
    state = { Component: AsyncComponent.Component };

    componentWillMount() {
      if (!this.state.Component) {
        getComponent().then(Component => {
          AsyncComponent.Component = Component
          this.setState({ Component })
        })
      }
    }
    render() {
      const { Component } = this.state
      if (Component) {
        return <Component {...this.props} />
      }
      return <div style={{ margin: 'auto' }}> loading... </div>
    }
  }
}

