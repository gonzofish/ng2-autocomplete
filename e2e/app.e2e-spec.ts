import { MyAutocompletePage } from './app.po';

describe('my-autocomplete App', function() {
  let page: MyAutocompletePage;

  beforeEach(() => {
    page = new MyAutocompletePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
