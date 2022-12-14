import { Selector } from 'testcafe';
import { ComponentIDs, PageIDs } from '../imports/ui/utilities/ids';

class UserPage {
  constructor() {
    this.pageId = `#${PageIDs.profilePage}`;
    this.pageSelector = Selector(this.pageId);
  }

  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async addInterest(testController) {
    await testController.click('#add-interest-btn');
    const dropdown = await Selector('#selectInterest');
    const dropdownOption = dropdown.find('option');
    await testController
      .click(dropdown)
      .click(dropdownOption.withText('Anime'))
      .click('#confirm-add-interest').pressKey('down');
  }

  async gotoEditProfile(testController) {
    await testController.click('#edit-profile-btn');
  }

  async testEditProfileInput(testController) {
    const editProfileName = 'Cam Moore';
    const editAboutMe = 'I am a teacher.';
    const editProfilePic = 'https://cammoore.github.io/img/cam-moore.jpg';
    await testController.selectText(`#${ComponentIDs.homeFormFirstName}`).pressKey('delete');
    await testController.typeText(`#${ComponentIDs.homeFormFirstName}`, editProfileName);
    await testController.selectText(`#${ComponentIDs.homeFormBio}`).pressKey('delete');
    await testController.typeText(`#${ComponentIDs.homeFormBio}`, editAboutMe);
    await testController.selectText('#profile-picture').pressKey('delete');
    await testController.typeText('#profile-picture', editProfilePic);
    await testController.click('#save-changes-btn');
  }
}

export const userPage = new UserPage();
