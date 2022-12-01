import { Selector } from 'testcafe';
import { PageIDs } from '../imports/ui/utilities/ids';

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

/*
  async testAddAdminPermissions(testController) {
    // TODO
    await testController.click(`#${ComponentIDs.addAdminPermsBtn}`);
  }

  async testRemoveAdminPermissions(testController) {
    // TODO
  }

  async testResetPassword(testController) {
    // TODO
  }

  async testDeleteUser(testController) {
    // TODO
  }
*/
}

export const adminPage = new AdminPage();
