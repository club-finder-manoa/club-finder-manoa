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
const credentials = { username: 'john@hawaii.edu', password: 'changeme' };
const adminCredentials = { username: 'admin@hawaii.edu', password: 'changeme' };

fixture('Club Finder Manoa localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up', async (testController) => {
  await landingPage.isDisplayed(testController);
});

test('Test that signup page, then logout works', async (testController) => {
  // Create a new user email address that's guaranteed to be unique.
  const newUser = `user-${new Date().getTime()}@hawaii.edu`;
  await navBar.gotoSignUpPage(testController);
  await signupPage.isDisplayed(testController);
  await signupPage.signupUser(testController, newUser, credentials.password);
  // New user has successfully logged in, so now let's logout.
  await navBar.logout(testController);
  await signOutPage.isDisplayed(testController);
});

test('Test that signin and signout work', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await navBar.isLoggedIn(testController, credentials.username);
  await navBar.logout(testController);
  await signOutPage.isDisplayed(testController);
});

test('Test the All Clubs page', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoAllClubsPage(testController);
  await allClubsPage.isDisplayed(testController);
  await allClubsPage.hasDefaultAllClubs(testController);
  await allClubsPage.testListCardView(testController);
  await allClubsPage.testSearchOptionsName(testController);
  await allClubsPage.saveClub(testController);
});

test('Test the Club Information page', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoAllClubsPage(testController);
  await clubsInfoPage.gotoClubInfoPage(testController);
  await clubsInfoPage.isDisplayed(testController);
});

test('Test the Club save in Club Information page', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoAllClubsPage(testController);
  await clubsInfoPage.gotoClubInfoPage(testController);
  await clubsInfoPage.isDisplayed(testController);
  await clubsInfoPage.clubInfoSave(testController);
});

test('Test the Club remove in Club Information page', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoAllClubsPage(testController);
  await clubsInfoPage.gotoClubInfoPage(testController);
  await clubsInfoPage.isDisplayed(testController);
  await clubsInfoPage.clubInfoRemove(testController);
});
test('Test the My Club page', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoMyClubsPage(testController);
  await myClubsPage.isDisplayed(testController);
  await myClubsPage.hasDefaultMyClubs(testController);
  await myClubsPage.testMyClubsView(testController);
  await myClubsPage.testRemoveMyClub(testController);
});

test.only('Test the Admin page', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, adminCredentials.username, adminCredentials.password);
  await navBar.gotoAdminPage(testController);
  await adminPage.isDisplayed(testController);
  await adminPage.hasDefaultUsers(testController);
  await adminPage.testAddAdminPermissions(testController);
  await adminPage.testRemoveAdminPermissions(testController);
  // await adminPage.testDeleteUser(testController);
  await adminPage.testResetPassword(testController);
  // TODO add other admin tests
});

test('Test the Profile page', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoUserPage(testController);
  await userPage.isDisplayed(testController);
});

test('Test the Profile Edit page', async (testController) => {
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoUserPage(testController);
  await userPage.isDisplayed(testController);
  await userPage.gotoEditProfile(testController);
  await userPage.testEditProfileInput(testController);
});

/** OLD BOWFOLIOS TESTS - left as reference, remove after implementing our own */
/*
test('Test that signup page, then logout works', async (testController) => {
  // Create a new user email address that's guaranteed to be unique.
  const newUser = `user-${new Date().getTime()}@foo.com`;
  await navBar.gotoSignUpPage(testController);
  await signupPage.isDisplayed(testController);
  await signupPage.signupUser(testController, newUser, credentials.password);
  // New user has successfully logged in, so now let's logout.
  await navBar.logout(testController);
  await signOutPage.isDisplayed(testController);
});

test('Test that profiles page displays', async (testController) => {
  await navBar.gotoProfilesPage(testController);
  await profilesPage.isDisplayed(testController);
  await profilesPage.hasDefaultProfiles(testController);
});

test('Test that interests page displays', async (testController) => {
  await navBar.gotoInterestsPage(testController);
  await interestsPage.isDisplayed(testController);
  await interestsPage.hasDefaultInterests(testController);
});

test('Test that projects page displays', async (testController) => {
  await navBar.gotoProjectsPage(testController);
  await projectsPage.isDisplayed(testController);
  await projectsPage.hasDefaultProjects(testController);
});

test('Test that home page display and profile modification works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await homePage.isDisplayed(testController);
  await homePage.updateProfile(testController, credentials.firstName);
  await navBar.ensureLogout(testController);
});

test('Test that addProject page works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoAddProjectPage(testController);
  await addProjectPage.isDisplayed(testController);
  await addProjectPage.addProject(testController);
});

test('Test that filter page works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSignInPage(testController);
  await signInPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoFilterPage(testController);
  await filterPage.isDisplayed(testController);
  await filterPage.filter(testController);
});
*/
