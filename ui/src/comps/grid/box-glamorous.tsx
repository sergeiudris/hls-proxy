import * as React from 'react'

import styled, { injectGlobal, ThemeProvider, StyledFunction, withprops } from 'src/styled-components'

import glam, { Div, CSSProperties } from 'glamorous'
import { css } from 'glamor'

const titleRule: any = css({
  color: 123,
  backGroundColor: 'green',
  display: 'flex'
} as CSSProperties)

const theme = {
  main: { color: 'red' }
}

interface IProps {
  color?: string
  theme?: typeof theme
}

const Title = glam.h1<IProps>(({ theme }) => ({
  fontSize: '10px',
  color: theme.main.color
}))



const pureDivFactory = glam('div', {
  shouldClassNameUpdate(props, previousProps, context, previousContext) {
    // return `true` to update the classname and
    // `false` to skip updating the class name
    return true
  },
})

const Divv = pureDivFactory({
  marginLeft: 1,
})


const Title1 = Title.withProps({
  color: 'grey'
})


const x = <Title className={titleRule.toString()} />


function render(c) { }

// when creating a glamorousComponentFactory
const bigDivFactory = glam('div', { withProps: { big: true } })
const BigDiv = bigDivFactory(({ big }) => ({ fontSize: big ? 20 : 10 }))
render(<BigDiv />) // renders with fontSize: 20
render(<BigDiv big={false} />) // renders with fontSize: 10


const boxFactory = glam<IPropsBox, object, IPropsBox>('div', {
  shouldClassNameUpdate(props, previousProps, context, previousContext) {
    return true
  },
  withProps: {
    padding: 'unset',
    margin: 'unset',
    overflow: 'unset'
  }
})


export const Box = boxFactory(p => ({
  display: display(p),
  flex: flex(p),
  position: position(p),
  flexDirection: flexDirection(p),
  width: size(p, 'width'),
  height: size(p, 'height'),
  flexWrap: flexWrap(p),
  alignItems: alignItems(p),
  justifyContent: justifyContent(p),
  alignContent: alignContent(p),
  padding: p.padding,
  margin: p.margin,
  overflow: p.overflow,
}))



// const Xx = glam(Box,{
//   fasd: 3,
//   flexWrap: '123123'
// })

const xxx = <Box innerRef={r => r} />

// const withFlex = Component => {
//   return glam<{flex: boolean}>(Component, {
//     filterProps: ['flex'],
//   } as any)(
//     ({flex}) => (flex ? {display: 'flex'} : undefined),
//   )
// }

// const MyComponent = withFlex(props => (<div {...props} />))

// const aaa = <MyComponent flex />




// export const Boxx = withprops<IPropsBox>()(styled.div) `
//   position: ${p => { console.warn(p); return position(p) }};
//   flex: ${p => flex(p)};
//   display: ${p => p.display ? p.display : 'flex'};
//   flex-direction: ${p => flexDirection(p)};
//   width: ${p => size(p, 'width')};
//   height: ${p => size(p, 'height')};
//   flex-wrap: ${p => flexWrap(p)};
//   align-items: ${p => alignItems(p)};
//   justify-content: ${p => justifyContent(p)};
//   align-content: ${p => alignContent(p)};
//   padding: ${p => p.padding};
//   margin: ${p => p.margin};
//   overflow: ${p => p.overflow};

// `

export default Box

type CSSDisplay = CSSProperties['display']
type CSSPosition = CSSProperties['position']
type CSSFlex = CSSProperties['flex']
type CSSOverflow = CSSProperties['overflow']
type CSSWidth = CSSProperties['width']
type CSSHeight = CSSProperties['height']
type CSSFlexWrap = CSSProperties['flexWrap']
type CSSFlexDirection = CSSProperties['flexDirection']
type CSSAlignItems = CSSProperties['alignItems']




interface IPropsBox {

  display?: CSSDisplay

  overflow?: CSSOverflow
  /** position */
  position?: CSSPosition
  /** flex-direction: column */
  flexcol?: boolean
  /** flex-direction: row */
  flexrow?: boolean
  /** width */
  width?: CSSWidth
  /** height */
  height?: CSSHeight
  /** flex-wrap: wrap */
  wrap?: CSSFlexWrap

  flex?: CSSFlex

  /** align-items: normal */
  ainormal?: boolean
  /** align-items: center */
  aicenter?: boolean
  /** align-items: stretch */
  aistretch?: boolean
  /** align-items: end */
  aiend?: boolean
  /** align-items: start  */
  aistart?: boolean
  /** align-items: flex-end */
  aiflexend?: boolean
  /** align-items: flex-start  */
  aiflexstart?: boolean
  /** align-items: left */
  aileft?: boolean
  /** align-items: right */
  airight?: boolean

  /** align-items: self-start */
  aiselfstart?: boolean
  /** align-items: self-end */
  aiselfend?: boolean
  /** align-items: baseline */
  aibase?: boolean
  /** align-items: first baseline */
  aibasefirst?: boolean
  /** align-items: last baseline */
  aibaselast?: boolean
  /** align-items: safe center */
  aisafecenter?: boolean
  /** align-items: unsafe center */
  aiunsafecenter?: boolean
  /** align-items: initial */
  aiinitial?: boolean
  /** align-items: inherit */
  aiinherit?: boolean
  /** align-items: unset */
  aiunset?: boolean

  /** justify-content: center */
  jccenter?: boolean
  /** justify-content: flex-end */
  jcflexend?: boolean
  /** justify-content: flex-start  */
  jcflexstart?: boolean
  /** justify-content: end */
  jcend?: boolean
  /** justify-content: start  */
  jcstart?: boolean
  /** justify-content: left */
  jcleft?: boolean
  /** justify-content: right */
  jcright?: boolean

  /** justify-content: space-between */
  jcbetween?: boolean
  /** justify-content: space-around */
  jcaround?: boolean
  /** justify-content: space-evenly */
  jcevenly?: boolean
  /** justify-content: stretch */
  jcstretch?: boolean

  /** justify-content: baseline */
  jcbase?: boolean
  /** justify-content: first baseline */
  jcbasefirst?: boolean
  /** justify-content: last baseline */
  jcbaselast?: boolean
  /** justify-content: safe center */
  jcsafecenter?: boolean
  /** justify-content: unsafe center */
  jcunsafecenter?: boolean
  /** justify-content: initial */
  jcinitial?: boolean
  /** justify-content: inherit */
  jcinherit?: boolean
  /** justify-content: unset */
  jcunset?: boolean


  /** align-content: center */
  accenter?: boolean
  /** align-content: flex-end */
  acflexend?: boolean
  /** align-content: flex-start  */
  acflexstart?: boolean
  /** align-content: end */
  acend?: boolean
  /** align-content: start  */
  acstart?: boolean
  /** align-content: left */
  acleft?: boolean
  /** align-content: right */
  acright?: boolean

  /** align-content: space-between */
  acbetween?: boolean
  /** align-content: space-around */
  acaround?: boolean
  /** align-content: space-evenly */
  acevenly?: boolean
  /** align-content: stretch */
  acstretch?: boolean

  /** align-content: baseline */
  acbase?: boolean
  /** align-content: first baseline */
  acbasefirst?: boolean
  /** align-content: last baseline */
  acbaselast?: boolean
  /** align-content: safe center */
  acsafecenter?: boolean
  /** align-content: unsafe center */
  acunsafecenter?: boolean
  /** align-content: initial */
  acinitial?: boolean
  /** align-content: inherit */
  acinherit?: boolean
  /** align-content: unset */
  acunset?: boolean

  padding?: string

  margin?: string

}

function display(props: IPropsBox): CSSDisplay {
  if (props.flexcol) {
    return 'flex'
  }
  if (props.flexrow) {
    return 'flex'
  }
  if (typeof props.display === 'string') {
    return props.display
  }
  return 'unset'

}

function position(props: IPropsBox): CSSPosition {
  if (typeof props.position == 'string') {
    return props.position
  }
  return 'unset'
}



function flexDirection(props: IPropsBox): CSSFlexDirection {
  if (props.flexcol) {
    return 'column'
  }
  return 'row'
}

function flexWrap(props: IPropsBox): CSSFlexWrap {
  if (props.wrap) {
    return 'wrap'
  }
  return 'unset'
}

function flex(props: IPropsBox): CSSFlex {
  if (typeof props.flex == 'string') {
    return props.flex
  }
  if (typeof props.flex == 'boolean') {
    return '1 1 auto'
  }
  return 'unset'
}



function size(props: IPropsBox, key: string): CSSWidth | CSSHeight {

  if (typeof props[key] == 'undefined') {
    return 'auto'
  }

  if (typeof props[key] == 'string') {
    return props[key]
  }

  if (typeof props[key] == 'number') {
    if (props[key] <= 1) {
      return `${props[key] * 100}%`
    }
    return `${props[key]}px`
  }
  return 'unset'

}

function alignItems(props: IPropsBox): any {
  if (props.aicenter) {
    return 'center'
  }
  if (props.ainormal) {
    return 'normal'
  }
  if (props.aistretch) {
    return 'stretch'
  }
  if (props.aiend) {
    return 'end'
  }
  if (props.aiflexend) {
    return 'flex-end'
  }
  if (props.aistart) {
    return 'start'
  }
  if (props.aiflexstart) {
    return 'flex-start'
  }


  if (props.aileft) {
    return 'left'
  }
  if (props.airight) {
    return 'right'
  }

  if (props.aiselfstart) {
    return 'self-start'
  }
  if (props.aiselfend) {
    return 'self-end'
  }
  if (props.aibase) {
    return 'baseline'
  }
  if (props.aibasefirst) {
    return 'first baseline'
  }
  if (props.aibaselast) {
    return 'last baseline'
  }
  if (props.aisafecenter) {
    return 'safe center'
  }
  if (props.aiunsafecenter) {
    return 'unsafe center'
  }
  if (props.aiinherit) {
    return 'inherit'
  }
  if (props.aiinitial) {
    return 'initial'
  }
  if (props.aiunset) {
    return 'unset'
  }

  return 'stretch'
}



function justifyContent(props: IPropsBox): any {
  if (props.jccenter) {
    return 'center'
  }

  if (props.jcend) {
    return 'end'
  }
  if (props.jcflexend) {
    return 'flex-end'
  }
  if (props.jcstart) {
    return 'start'
  }
  if (props.jcflexstart) {
    return 'flex-start'
  }


  if (props.jcaround) {
    return 'space-around'
  }
  if (props.jcbetween) {
    return 'space-between'
  }
  if (props.jcevenly) {
    return 'space-evenly'
  }
  if (props.jcstretch) {
    return 'stretch'
  }

  if (props.jcleft) {
    return 'left'
  }
  if (props.jcright) {
    return 'right'
  }

  if (props.jcbase) {
    return 'baseline'
  }
  if (props.jcbasefirst) {
    return 'first baseline'
  }
  if (props.jcbaselast) {
    return 'last baseline'
  }
  if (props.jcsafecenter) {
    return 'safe center'
  }
  if (props.jcunsafecenter) {
    return 'unsafe center'
  }
  if (props.jcinherit) {
    return 'inherit'
  }
  if (props.jcinitial) {
    return 'initial'
  }
  if (props.jcunset) {
    return 'unset'
  }

  return 'flex-start'
}


function alignContent(props: IPropsBox): any {
  if (props.accenter) {
    return 'center'
  }

  if (props.acend) {
    return 'end'
  }
  if (props.acflexend) {
    return 'flex-end'
  }
  if (props.acstart) {
    return 'start'
  }
  if (props.acflexstart) {
    return 'flex-start'
  }


  if (props.acaround) {
    return 'space-around'
  }
  if (props.acbetween) {
    return 'space-between'
  }
  if (props.acevenly) {
    return 'space-evenly'
  }
  if (props.acstretch) {
    return 'stretch'
  }

  if (props.acleft) {
    return 'left'
  }
  if (props.acright) {
    return 'right'
  }

  if (props.acbase) {
    return 'baseline'
  }
  if (props.acbasefirst) {
    return 'first baseline'
  }
  if (props.acbaselast) {
    return 'last baseline'
  }
  if (props.acsafecenter) {
    return 'safe center'
  }
  if (props.acunsafecenter) {
    return 'unsafe center'
  }
  if (props.acinherit) {
    return 'inherit'
  }
  if (props.acinitial) {
    return 'initial'
  }
  if (props.acunset) {
    return 'unset'
  }

  return 'stretch'
}
