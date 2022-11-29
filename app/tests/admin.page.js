import { Selector } from 'testcafe';
import { ComponentIDs, PageIDs } from '../imports/ui/utilities/ids';

class AdminPage {
  constructor() {
    this.pageId = `#${PageIDs.adminPage}`;
    this.pageSelector = Selector(this.pageId);
    this.wrongId = '#poop';
    this.wrongSelector = Selector(this.wrongId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // Will add more tests later on
    await testController.expect(this.pageSelector.exists).ok();
  }

  async hasDefaultUsers(testController) {
    const userCount = Selector('tr').count;
    await testController.expect(userCount).gte(5); // 5 including header and the user that was just created earlier
  }

  async testAddAdminPermissions(testController) {
    // need to figure out how to select a specific button from the table
    await testController.click(`#${ComponentIDs.addAdminPermsBtn}`);
  }

  async testSearchOptionsName(testController) {
    const clubName = 'Engineer';
    await testController.click('#search-option-drpdwn');
    await testController.click('#search-by-name');
    await testController.typeText('#search-by-name', clubName);
  }

  async testClubView(testController) {
    await testController.click('#club-header');
  }
}

export const adminPage = new AdminPage();
