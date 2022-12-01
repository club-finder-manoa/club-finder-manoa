import { Selector } from 'testcafe';
import { ComponentIDs } from '../imports/ui/utilities/ids';

class UserPage {
  constructor() {
    this.pageId = '#user-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async gotoEditProfile(testController) {
    await testController.click('#edit-profile-btn');
  }

  async testEditProfileInput(testController) {
    const editFirstName = 'Cam';
    const editLastName = 'Moore';
    const editAboutMe = 'I am a teacher.';
    await testController.selectText(`#${ComponentIDs.homeFormFirstName}`).pressKey('delete');
    await testController.click(`#${ComponentIDs.homeFormFirstName}`);
    await testController.typeText(`#${ComponentIDs.homeFormFirstName}`, editFirstName);
    await testController.selectText(`#${ComponentIDs.homeFormLastName}`).pressKey('delete');
    await testController.click(`#${ComponentIDs.homeFormLastName}`);
    await testController.typeText(`#${ComponentIDs.homeFormLastName}`, editLastName);
    await testController.selectText(`#${ComponentIDs.homeFormBio}`).pressKey('delete');
    await testController.click(`#${ComponentIDs.homeFormBio}`);
    await testController.typeText(`#${ComponentIDs.homeFormBio}`, editAboutMe);
    await testController.click('#pic-field');
  }
}

export const userPage = new UserPage();
