const webdriver = require("selenium-webdriver");
var assert = require('assert');
var until = webdriver.until;
var By = webdriver.By;
var Key = webdriver.Key;
var util = require('util');

const title = 'Пассажиры (2016) смотреть онлайн бесплатно';

let enterLink = webdriver.By.linkText('Вход');
let loginField = webdriver.By.name('login_name');
let passwordField = webdriver.By.id('login_password');
let enterButton = webdriver.By.xpath('//button[contains(*, "Войти")]');
let searchForm = webdriver.By.css('input[name*=story]');
let okButton = webdriver.By.xpath('//button[contains(*, "ok")]');
let moveName = webdriver.By.css('a[href*="passazhiry"]');

function createDriver() {
  let driver = new webdriver.Builder()
    .usingServer('http://localhost:4444/wd/hub')
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();
  driver.manage().timeouts().setScriptTimeout(100000);
  return driver;
}

let browser = createDriver();

browser.get('http://kinogo.club/');

browser.findElement(searchForm)
  .then((search) => {
    browser.wait(until.elementIsVisible(search))
      .then((visibleElement) => {
        return visibleElement.sendKeys('Пассажиры')
          .then(() => {

            return browser.actions().sendKeys(Key.ENTER).perform();
          })
      });
  })
browser.findElement(moveName)
  .then(move => {
    return browser.actions().mouseMove(move).click().perform();
  });
browser.executeScript('window.scrollTo(0, document.body.scrollHeight)');

browser.getTitle().then(value => {
  return assert.equal(value, title);
});

browser.executeScript('window.scrollTo(0, 0)');

browser.findElement(enterLink)
  .then(link => {
    return browser.actions().mouseMove(link).click().perform();
  })
  .then(() => {
    return browser.findElement(loginField)
  }).then(login => {
  login.sendKeys('tanyaslavinskaya');
  return browser.executeAsyncScript("arguments[0].style.backgroundColor = '" + "yellow" + "'", login);
});

browser.getAllWindowHandles().then((windowHandles) => {
  return assert.equal(windowHandles.length, 1, "Not equal");
});

browser.quit();


