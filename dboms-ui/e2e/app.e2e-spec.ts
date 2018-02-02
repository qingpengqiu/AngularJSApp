import { DcoaUiPage } from './app.po';

describe('dcoa-ui App', () => {
  let page: DcoaUiPage;

  beforeEach(() => {
    page = new DcoaUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('dc works!');
  });
});
