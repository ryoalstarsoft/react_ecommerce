import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import mixpanel from 'mixpanel-browser';
import matchMediaPolyfill from 'mq-polyfill';
import { config } from 'dotenv';

config()
configure({ adapter: new Adapter() });

matchMediaPolyfill(global.window)
global.window
  .matchMedia('(min-width: 920px)') // Create MediaQueryList instance
  .addListener(console.log)// Subscribe to MQ mode changes

// initialize mixpanel
mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN)
global.mixpanel = mixpanel
