import { Selector } from 'testcafe';
import { ComponentIDs } from '../imports/ui/utilities/ids';

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
    await testController.wait(1000).expect(this.pageSelector.exists).ok();
  }

  async clubInfoSave(testController) {
    await testController.click('#save-club-btn');
    await testController.click('#save-btn');
  }

  async clubInfoRemove(testController) {
    await testController.click('#remove-myclub-x');
    await testController.click('#remove-club-btn');
  }

  async testClubEdit(testController) {
    const editClubName = 'Accounting';
    const dropdown = await Selector(`#${ComponentIDs.clubType}`);
    const dropdownOption = dropdown.find('option');
    const editWebsiteLink = 'https://acuh.com/';
    const editDescription = 'School of Accountancy';
    const editMainPhoto = 'https://previews.123rf.com/images/nsit0108/nsit01081810/nsit0108181000188/109046393-accounting-icon-set-outline-set-of-accounting-vector-icons-for-web-design-isolated-on-white-backgrou.jpg';
    const editTime = '2:00 PM';
    const editLocation = 'Holmes Hall';
    const editContactName = 'Gwen Raquepo';
    const editContactEmail = 'graquepo@hawaii.edu';
    await testController.click('#edit-club-btn');
    await testController.selectText(`#${ComponentIDs.clubName}`).pressKey('delete');
    await testController.typeText(`#${ComponentIDs.clubName}`, editClubName);
    await testController
      .click(dropdown)
      .click(dropdownOption.withText('Service'));
    await testController.selectText(`#${ComponentIDs.clubLink}`).pressKey('delete');
    await testController.typeText(`#${ComponentIDs.clubLink}`, editWebsiteLink);
    await testController.selectText(`#${ComponentIDs.clubDescription}`).pressKey('delete');
    await testController.typeText(`#${ComponentIDs.clubDescription}`, editDescription);
    await testController.selectText(`#${ComponentIDs.mainPhoto}`).pressKey('delete');
    await testController.typeText(`#${ComponentIDs.mainPhoto}`, editMainPhoto);
    await testController.selectText('#meeting-sunday-time');
    await testController.typeText('#meeting-sunday-time', editTime);
    await testController.selectText('#meeting-sunday-location');
    await testController.typeText('#meeting-sunday-location', editLocation);
    await testController.selectText('#meeting-monday-time');
    await testController.typeText('#meeting-monday-time', editTime);
    await testController.selectText('#meeting-monday-location');
    await testController.typeText('#meeting-monday-location', editLocation);
    await testController.selectText('#meeting-tuesday-time');
    await testController.typeText('#meeting-tuesday-time', editTime);
    await testController.selectText('#meeting-tuesday-location');
    await testController.typeText('#meeting-tuesday-location', editLocation);
    await testController.selectText('#meeting-wednesday-time');
    await testController.typeText('#meeting-wednesday-time', editTime);
    await testController.selectText('#meeting-wednesday-location');
    await testController.typeText('#meeting-wednesday-location', editLocation);
    await testController.selectText('#meeting-thursday-time');
    await testController.typeText('#meeting-thursday-time', editTime);
    await testController.selectText('#meeting-thursday-location');
    await testController.typeText('#meeting-thursday-location', editLocation);
    await testController.selectText('#meeting-friday-time');
    await testController.typeText('#meeting-friday-time', editTime);
    await testController.selectText('#meeting-friday-location');
    await testController.typeText('#meeting-friday-location', editLocation);
    await testController.selectText('#meeting-saturday-time');
    await testController.typeText('#meeting-saturday-time', editTime);
    await testController.selectText('#meeting-saturday-location');
    await testController.typeText('#meeting-saturday-location', editLocation);
    await testController.selectText(`#${ComponentIDs.clubContactName}`).pressKey('delete');
    await testController.typeText(`#${ComponentIDs.clubContactName}`, editContactName);
    await testController.selectText(`#${ComponentIDs.clubContactEmail}`).pressKey('delete');
    await testController.typeText(`#${ComponentIDs.clubContactEmail}`, editContactEmail);
    await testController.click('#save-changes-btn');
  }
}

export const clubsInfoPage = new ClubsInfoPage();
