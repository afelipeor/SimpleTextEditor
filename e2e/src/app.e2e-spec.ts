import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
	let page: AppPage;

	beforeEach(() => {
		page = new AppPage();
	});

	it('should display toolbar', () => {
		page.navigateTo();
		expect(page.getToolbarParagraphText()).toEqual('toolbar works!');
	});

	it('should display editor', () => {
		page.navigateTo();
		expect(page.getEditorComponent().isPresent()).toBeTruthy();
	});

	afterEach(async () => {
		// Assert that there are no errors emitted from the browser
		const logs = await browser.manage().logs().get(logging.Type.BROWSER);
		expect(logs).not.toContain(
			jasmine.objectContaining({
				level: logging.Level.SEVERE,
			} as logging.Entry)
		);
	});
});
