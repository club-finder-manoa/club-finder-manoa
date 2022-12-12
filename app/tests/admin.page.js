import { Selector } from 'testcafe';
import { PageIDs } from '../imports/ui/utilities/ids';

class AdminPage {
  constructor() {
    this.pageId = `#${PageIDs.adminPage}`;
    this.pageSelector = Selector(this.pageId);
    this.wrongId = '#poop'; // lol
    this.wrongSelector = Selector(this.wrongId);
  }

  /** Asserts that this page is currently displayed. */
  async isDisplayed(testController) {
    // Will add more tests later on
    await testController.expect(this.pageSelector.exists).ok();
  }

  async hasDefaultUsers(testController) {
    const userCount = Selector('tr').count;
    await testController.expect(userCount).gte(3); // 3 default accs
  }

  async testAddAdminPermissions(testController) {
    await testController.click('#admin-add-club');
    await testController.click('#admin-form-select').pressKey('down').pressKey('enter');
    await testController.click('#confirm-add-club');
  }

  async testRemoveAdminPermissions(testController) {
    await testController.click('#remove-admin-btn');
    await testController.click('#confirm-remove-admin');
  }

  async testDeleteUser(testController) {
    await testController.click('#delete-user-btn-testcafeuser');
    await testController.click('#confirm-user-delete').pressKey('enter');
    // [ERROR]A native alert dialog was invoked on page "http://localhost:3000/admin", but no handler was set for it.
    // Use the "setNativeDialogHandler" function to introduce a handler function for native dialogs.

  }

  async testResetPassword(testController) {
    await testController.click('#reset-password-btn');
    await testController.click('#confirm-reset-password');
    // TODO
  }
}

export const adminPage = new AdminPage();
