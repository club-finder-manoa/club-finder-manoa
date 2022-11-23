import { Selector } from 'testcafe';
import { ComponentIDs } from '../imports/ui/utilities/ids';

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

  async hasDefaultAllClubs(testController) {
    const cardCount = Selector('.card').count;
    await testController.expect(cardCount).gte(146);
  }

  async testListCardView(testController) {
    await testController.click('#list-view-btn');
    await testController.click('#card-view-btn');
  }
}

export const allClubsPage = new AllClubsPage();
