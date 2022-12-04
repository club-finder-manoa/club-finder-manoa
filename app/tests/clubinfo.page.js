import { Selector } from 'testcafe';

class ClubsInfoPage {
  constructor() {
    this.pageId = '#club-info-page';
    this.pageSelector = Selector(this.pageId);
  }

  async gotoClubInfoPage(testController) {
    await testController.click('#club-header');
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // Will add more tests later on
    await testController.expect(this.pageSelector.exists).ok();
  }

  async clubInfoSave(testController) {
    await testController.click('#save-club-btn');
    await testController.click('#save-btn');
  }

  async clubInfoRemove(testController) {
    await testController.click('#remove-myclub-x');
    await testController.click('#remove-club-btn');
  }
}

export const clubsInfoPage = new ClubsInfoPage();
