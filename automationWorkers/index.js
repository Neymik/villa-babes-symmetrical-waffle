
import { Builder } from 'selenium-webdriver';
import { ServiceBuilder, Options as _Options } from 'selenium-webdriver/chrome.js';

import axios from 'axios';

import AutomationWorker from './AutomationWorker.js';
import ofCreators from '../models/ofCreators.js';

const browserPath = '/Users/neymik/Library/Application\ Support/adspower_global/cwd_global/chrome_112/SunBrowser.app';
const adsUrl = 'http://local.adspower.net:50325';
const adsKey = '6ec4793c1f37eab14e1a14ba49dd3a6c';
const adsUserId = 'j9mn552';
const creatorId = 1;





async function start() {

  console.log('init...');

  const connectionData = await axios({
    url: adsUrl + '/api/v1/browser/start' + '?user_id=' + adsUserId,
    method: 'GET'
  });

  console.log('browser started');

  const seleniumWebdriver = connectionData.data.data.webdriver;
  const seleniumDebuggingPort = connectionData.data.data.debug_port;

  let driver;
  try {
    const service = new ServiceBuilder(seleniumWebdriver);
    
    const options = new _Options();
    // options.setChromeBinaryPath(browserPath);
    options.addArguments('--remote-debugging-port=' + seleniumDebuggingPort);

    driver = new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .setChromeOptions(options)
      .build();
  } catch (e) {
    console.log('Selenium build error');
    console.error(e);
  }

  console.log('driver built')

  try {
    await driver.manage().setTimeouts({ implicit: 2000 });
    await driver.switchTo().newWindow('tab');
    
    await AutomationWorker.scrapAllMembers(driver, creatorId);
    
  } catch (e) {
    console.log('Selenium runtime error');
    console.error(e);
  }

  try {
    await driver.close();
    await driver.quit();
  } catch (e) {
  }

  console.log('automation done')

}

start();
