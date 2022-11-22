import { Selector } from 'testcafe';

class AllClubsPage {
  constructor() {
    this.pageId = '#all-clubs-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 20 seconds to avoid timeouts with GitHub Actions.
    // Will add more tests later on
    await testController.wait(10000).expect(this.pageSelector.exists).ok();
  }
}

export const allClubsPage = new AllClubsPage();
