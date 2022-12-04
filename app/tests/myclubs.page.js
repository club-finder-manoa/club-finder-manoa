import { Selector } from 'testcafe';
import { PageIDs } from '../imports/ui/utilities/ids';

class MyClubsPage {
  constructor() {
    this.pageId = `#${PageIDs.myClubsPage}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // This is first test to be run. Wait 20 seconds to avoid timeouts with GitHub Actions.
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Checks that the current page has at least 2 clubs on it.  */
  async hasDefaultMyClubs(testController) {
    const cardCount = Selector('.card').count;
    await testController.expect(cardCount).gte(2);
  }

  async testMyClubsView(testController) {
    await testController.click('#myclubs-club-header');
  }

  async testRemoveMyClub(testController) {
    await testController.click('#remove-myclub-x');
    await testController.click('#remove-club-btn');
  }
}

export const myClubsPage = new MyClubsPage();
