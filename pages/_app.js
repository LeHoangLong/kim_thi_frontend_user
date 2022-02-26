import '../styles/globals.css'
import '../styles/normalize.css'
import '../styles/main.css'
import '../styles/Main.scss'
import React from 'react';
import {Provider} from 'react-redux'
import { createWrapper } from "next-redux-wrapper";

import store from '../reducers/rootReducer.tsx'

function MyApp({ Component, pageProps }) {
  return <Provider store={ store }>
      <React.Fragment>
        <Component {...pageProps} />
      </React.Fragment>
  </Provider>
}

const makestore = () => store
const wrapper = createWrapper(makestore)
export default wrapper.withRedux(MyApp)
