const {HomePage} = require('../pageobjects/home.page.js');
const {SecondPage} = require('../pageobjects/second.page.js');

let issues;

describe('Test versions information', () => {
  it('Should print test version information', async () => {
    const TEST_RUN_TIME = new Date().toLocaleString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });

    const getPackageVersion = (PACKAGE_NAME) => {
      try {
        const file = '../../node_modules/' + PACKAGE_NAME + '/package.json';
        const json = require(file);
        return json.version;
      } catch (err) {
        console.log('Package not found: ' + err);
      }
    };

    process.emit('test:log', `VM version: NodeJS ${process.version}\n` +
    `Framework version: WebdriverIO ${getPackageVersion('webdriverio')}\n` +
    `Test run date: ${TEST_RUN_TIME}\n` +
    `SDK version: WebdriverIO SDK ${getPackageVersion('@evinced/webdriverio-sdk')}`);
  });
});

describe('Example without Evinced SDK - As a user I want to ' +
  'choose the stay and see proper results', () => {
  it('Should go to evinced demo site and perform actions', async () => {
    await browser.url('https://demo.evinced.com/');
    await HomePage.typeDropdown().click();
    await HomePage.tinyHomeOption().click();
    await HomePage.whereDropdown().click();
    await HomePage.eastCoastOption().click();
    await HomePage.btnSearch().click();
  });
  it('Should see new page with results"', async () => {
    expect(SecondPage.pageHeader()).toHaveTextContaining('Results for: Tiny House in East Coast');
  });
});

describe('Example with evStart-evStop - As a user I want to ' +
  'record all accessibility issues during my interaction with page', () => {
  it('Should go to evinced demo site and perform actions', async () => {
    await browser.url('https://demo.evinced.com/');
    await browser.evStart();
    await HomePage.typeDropdown().click();
    await HomePage.tinyHomeOption().click();
    await HomePage.whereDropdown().click();
    await HomePage.eastCoastOption().click();
    await HomePage.btnSearch().click();

    issues = await browser.evStop();
  });
  // This assertion is intended to fail to demonstrate how to assert accessibility issues
  it('There should be no accessibility issues on the site"', async () => {
    expect(issues.length).toEqual(0);
  });
});

describe('Example with evStart-evStop and evSaveFile - As a user I want to ' +
  'record all occuring acessibility issues and save them as html report', () => {
  it('Should go to evinced demo site and perform actions', async () => {
    await browser.url('https://demo.evinced.com/');
    await browser.evStart();
    await HomePage.typeDropdown().click();
    await HomePage.tinyHomeOption().click();
    await HomePage.whereDropdown().click();
    await HomePage.eastCoastOption().click();
    await HomePage.btnSearch().click();

    issues = await browser.evStop();
  });
  it('Should save report with name "evSaveFileReport" and type "html"', async () => {
    await browser.evSaveFile(issues, 'html', `./reports/evReports/evSaveFileReport.html`);
  });
  it('Should see new page with results"', async () => {
    expect(SecondPage.pageHeader()).toHaveTextContaining('Results for: Tiny House in East Coast');
  });
});

describe('Example with different configuration - As a user I want to ' +
  'record all issues occuring in a given root selector', () => {
  it('Should go to evinced demo site and perform actions', async () => {
    await browser.url('https://demo.evinced.com/');

    browser.evincedOptions.rootSelector = '#gatsby-focus-wrapper > main > div.wrapper-banner ' +
      '> div.filter-container > div:nth-child(1)';

    await browser.evStart();
    await HomePage.typeDropdown().click();
    await HomePage.tinyHomeOption().click();
    await HomePage.whereDropdown().click();
    await HomePage.eastCoastOption().click();
    await HomePage.btnSearch().click();

    issues = await browser.evStop();
  });
  it('Should save report with name "evConfigChangeReport" and type "html"', async () => {
    await browser.evSaveFile(issues, 'html', `./reports/evReports/evConfigChangeReport.html`);
  });
  it('Should see new page with results"', async () => {
    expect(SecondPage.pageHeader()).toHaveTextContaining('Results for: Tiny House in East Coast');
  });
});

describe('Example with before-after hooks - As a user I want to ' +
  'record all accessibility issues and save the report', () => {
  beforeEach(async () => {
    await browser.evStart();
  });
  it('Should go to evinced demo site and perform actions', async () => {
    await browser.url('https://demo.evinced.com/');
    await HomePage.typeDropdown().click();
    await HomePage.tinyHomeOption().click();
    await HomePage.whereDropdown().click();
    await HomePage.eastCoastOption().click();
    await HomePage.btnSearch().click();
  });
  it('Should see new page with results"', async () => {
    expect(SecondPage.pageHeader()).toHaveTextContaining('Results for: Tiny House in East Coast');
  });
  afterEach(async () => {
    await browser.evStop();
  });
});

describe('Example with evAnalyze - I want to ' +
  'snapshot all issues on home page with evAnalyze and save report as json', () => {
  it('Should go to evinced demo site and perform actions', async () => {
    await browser.url('https://demo.evinced.com/');
    issues = await browser.evAnalyze();
    await HomePage.typeDropdown().click();
    await HomePage.tinyHomeOption().click();
    await HomePage.whereDropdown().click();
    await HomePage.eastCoastOption().click();
    await HomePage.btnSearch().click();
  });
  it('Should save report with name "evAnalyzeReport" and type "json"', async () => {
    await browser.evSaveFile(issues, 'json', `./reports/evReports/evAnalyzeReport.json`);
  });
  it('Should see new page with results"', async () => {
    expect(SecondPage.pageHeader()).toHaveTextContaining('Results for: Tiny House in East Coast');
  });
});
