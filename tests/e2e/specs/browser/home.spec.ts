import { test } from '../../src/fixtures/test.js';
import { openWorkshopHome } from '../../src/steps/home.steps.js';

test('serves the application shell without task workflows', async ({ homePage }) => {
  await openWorkshopHome(homePage);
});
