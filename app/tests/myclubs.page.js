import { Selector } from 'testcafe';

class MyClubsPage {
  constructor() {
    this.pageId = '#my-clubs-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 20 seconds to avoid timeouts with GitHub Actions.
    await testController.wait(20000).expect(this.pageSelector.exists).ok();
  }

  /** Checks that the current page has at least 2 clubs on it.  */
  async hasDefaultMyClubs(testController) {
    const cardCount = Selector('.card').count;
    await testController.expect(cardCount).gte(2);
  }
}

export const myClubsPage = new MyClubsPage();
