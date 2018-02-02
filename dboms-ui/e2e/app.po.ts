import { browser, element, by } from 'protractor';

export class DcoaUiPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('dc-root h1')).getText();
  }
}
