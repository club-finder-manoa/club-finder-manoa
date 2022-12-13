import { landingPage } from './landing.page';
import { signInPage } from './signin.page';
import { signOutPage } from './signout.page';
import { navBar } from './navbar.component';
import { myClubsPage } from './myclubs.page';
import { allClubsPage } from './allclubs.page';
import { signupPage } from './signup.page';
import { adminPage } from './admin.page';
import { userPage } from './user.page';
import { clubsInfoPage } from './clubinfo.page';
/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@hawaii.edu', password: 'changeme', displayName: 'John' };
const adminCredentials = { username: 'admin@hawaii.edu', password: 'changeme', displayName: 'Admin' };

fixture('Club Finder Manoa localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up', async (testController) => {
  await landingPage.isDisplayed(testController);
});

test('Test that signup page, then logout works', async (testController) => {
  // Changing this to 'testcafeusertest' so we can delete the user at the end of the tests
  const newUser = 'testcafeuser@hawaii.edu';
  await navBar.gotoSignUpPage(testController);
  await signupPage.isDisplayed(testController);
  await signupPage.signupUser(testController, newUser, credentials.password);
  // New user has successfully logged in, so now let's logout.
  await navBar.logout(testController);
  await signOutPage.isDisplayed(testController);
});

test('Test that signin and signout work', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password, credentials.displayName);
  await navBar.isLoggedIn(testController, credentials.displayName);
  await navBar.logout(testController);
  await signOutPage.isDisplayed(testController);
});

test('Test the All Clubs page', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password, credentials.displayName);
  await navBar.gotoAllClubsPage(testController);
  await allClubsPage.isDisplayed(testController);
  await allClubsPage.hasDefaultAllClubs(testController);
  await allClubsPage.testListCardView(testController);
  await allClubsPage.testSearchOptionsName(testController);
  await allClubsPage.saveClub(testController);
});

test('Test the Club Information page', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password, credentials.displayName);
  await navBar.gotoAllClubsPage(testController);
  await clubsInfoPage.gotoClubInfoPage(testController);
  await clubsInfoPage.isDisplayed(testController);
});

test('Test the Club save in Club Information page', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password, credentials.displayName);
  await navBar.gotoAllClubsPage(testController);
  await clubsInfoPage.gotoClubInfoPage(testController);
  await clubsInfoPage.isDisplayed(testController);
  await clubsInfoPage.clubInfoSave(testController);
});

test('Test the Club remove in Club Information page', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password, credentials.displayName);
  await navBar.gotoAllClubsPage(testController);
  await clubsInfoPage.gotoClubInfoPage(testController);
  await clubsInfoPage.isDisplayed(testController);
  await clubsInfoPage.clubInfoRemove(testController);
});

test('Test the My Club page', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password, credentials.displayName);
  await navBar.gotoMyClubsPage(testController);
  await myClubsPage.isDisplayed(testController);
  await myClubsPage.hasDefaultMyClubs(testController);
  await myClubsPage.testMyClubsView(testController);
  await myClubsPage.testRemoveMyClub(testController);
});

test('Test the Profile page', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password, credentials.displayName);
  await navBar.gotoUserPage(testController);
  await userPage.isDisplayed(testController);
  await userPage.addInterest(testController);
});

test('Test the Profile Edit page', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password, credentials.displayName);
  await navBar.gotoUserPage(testController);
  await userPage.isDisplayed(testController);
  await userPage.gotoEditProfile(testController);
  await userPage.testEditProfileInput(testController);
});

test('Test Editing Club', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, adminCredentials.username, adminCredentials.password, adminCredentials.displayName);
  await navBar.gotoAllClubsPage(testController);
  await allClubsPage.isDisplayed(testController);
  await clubsInfoPage.gotoClubInfoPage(testController);
  await clubsInfoPage.isDisplayed(testController);
  await clubsInfoPage.testClubEdit(testController);
});

test('Test the Admin page', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, adminCredentials.username, adminCredentials.password, adminCredentials.displayName);
  await navBar.gotoAdminPage(testController);
  await adminPage.isDisplayed(testController);
  await adminPage.hasDefaultUsers(testController);
  await adminPage.testAddAdminPermissions(testController);
  await adminPage.testRemoveAdminPermissions(testController);
});

test('Test the Admin Password reset', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, adminCredentials.username, adminCredentials.password, adminCredentials.displayName);
  await navBar.gotoAdminPage(testController);
  await adminPage.isDisplayed(testController);
  await adminPage.testResetPassword(testController);
});

test('Test the Admin Delete User', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, adminCredentials.username, adminCredentials.password, adminCredentials.displayName);
  await navBar.gotoAdminPage(testController);
  await adminPage.isDisplayed(testController);
  await adminPage.testDeleteUser(testController);
});
