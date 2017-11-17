
// styled-components.ts
import * as React from 'react'
import { THEME_STYLED_COMPONENTS, IStyledComponentsTheme } from 'src/style'


import { ThemedStyledComponentsModule, StyledFunction, ThemedStyledFunction, withTheme } from 'styled-components';
import * as styledComponents from 'styled-components';
const {
  default: styled,
  css,
  injectGlobal,
  keyframes,
  ThemeProvider,
} = styledComponents as ThemedStyledComponentsModule<any> as ThemedStyledComponentsModule<IStyledComponentsTheme>;




// const div = <T, E = React.HTMLProps<HTMLInputElement>>(): StyledFunction<T & E> => styled.div

// interface P {
//   xxx: string
// }

// const Input = div<P>()`
//   border: ${p => p.xxx ? 'red' : 'blue'}
// `


export const withprops = <U>() =>
  <P, T, O>(
    fn: ThemedStyledFunction<P, T, O>
  ): ThemedStyledFunction<P & U, T, O & U> => fn;


interface ButtonProps {
  active: boolean;
}

//                                           / note () here
// export const Button = withProps<ButtonProps>()(styled.div)`
//   color: ${p => p.active ? 'red' : 'black'}
// `;

export { css, injectGlobal, keyframes, ThemeProvider, IStyledComponentsTheme, THEME_STYLED_COMPONENTS, StyledFunction, ThemedStyledFunction, withTheme };
export default styled;


// function styledComponentWithProps<T, U extends HTMLElement = HTMLElement>(styledFunction: StyledFunction<React.HTMLProps<U>>): StyledFunction<T & React.HTMLProps<U>> {
//   return styledFunction
// }

// interface MyProps {
//   // ...
//   xxx: number
// }
