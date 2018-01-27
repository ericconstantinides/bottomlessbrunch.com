// https://github.com/facebookincubator/create-react-app/issues/3199
import requestAnimationFrame from './tempPolyfills'

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter(), disableLifecycleMethods: true })
