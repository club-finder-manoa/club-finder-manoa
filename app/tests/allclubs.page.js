import { Selector } from 'testcafe';
import { PageIDs } from '../imports/ui/utilities/ids';

class AllClubsPage {
  constructor() {
    this.pageId = `#${PageIDs.allClubsPage}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // Will add more tests later on
    await testController.expect(this.pageSelector.exists).ok();
  }

  async hasDefaultAllClubs(testController) {
    const cardCount = Selector('.card').count;
    await testController.expect(cardCount).gte(146);
  }

  async testListCardView(testController) {
    await testController.click('#list-view-btn');
    await testController.click('#card-view-btn');
  }

  async testSearchOptionsName(testController) {
    const clubName = 'Engineer';
    await testController.click('#search-option-drpdwn');
    await testController.click('#search-by-name');
    await testController.typeText('#search-by-name', clubName);
  }

  async saveClub(testController) {
    await testController.click('#save-club-btn');
    await testController.click('#save-btn');
  }
}

export const allClubsPage = new AllClubsPage();
