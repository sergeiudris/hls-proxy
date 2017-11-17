import { injectGlobal } from 'src/styled-components'
injectGlobal`

      html {
        height: 100%;
        box-sizing: border-box;
        // font-size: 10px !important;
        // line-height: 0.8em;
      }

      *, *:before, *:after {
          box-sizing: inherit;
      }

      body {
          margin:0;
        padding: 0;
        height: 100%;
      }
      body > div:first-child {
          // display: flex;
        height: 100%;
      }

      // ul {
      //   margin: 0;
      //   padding: 0;
      //   -webkit-overflow-scrolling: touch;
      // }

      .ant-layout-sider-trigger {
        position: absolute !important;
      }
      .ant-layout-sider-children {
        height: 100%;
      }
      .ant-layout-sider-children > ul {
        background-color: #DCE9F1;
        height: calc(100% - 112px);
        display: flex;
        flex-direction: column;
        // align-items: center;
        justify-content: space-around;
      }

      @media only screen and (min-width:1480px) {
        html, body {
          font-size: 14px !important;
          // line-height: 1em;
        }
      }

      @media only screen and (max-width:1480px) {
         html, body {
          font-size: 14px !important;
          // line-height: 1.175em;
        }
      }

      @media only screen and (max-width: 768px) {
        html, body {
          font-size: 12px !important;
          // line-height: 1em;
        }
      }
      @media only screen and (max-width: 480px) {
         html, body {
          font-size: 10px  !important;
          // line-height: 1em;
        }
      }


      @media only screen and (max-width: 320px) {
         html, body{
          font-size: 9px !important;
          line-height: 1em;
        }
      }

    `
