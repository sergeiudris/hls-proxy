
import { THEMES_CONSTANTS } from './constants'
import { css } from 'styled-components'


export type IStyledComponentsTheme = typeof THEME_STYLED_COMPONENTS
export const THEME_STYLED_COMPONENTS = {
  primaryColor: 'white',
  primaryColorInverted: 'green',
  bordered: css`
    border: 1px solid lightgrey;
    border-radius: 3px;
    box-shadow: 0px 1px 1px 2px rgba(0, 0, 0, 0.12), 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  `
}




