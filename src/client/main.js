import ReactDOM from 'react-dom'
import {Copyright} from './components/Copyright'

ReactDOM.render(<Copyright props={{now: 'hi'}}/>, document.querySelector('.body-wrapper'))

//<react-component name="Copyright" props="now" watch-depth="reference"/>