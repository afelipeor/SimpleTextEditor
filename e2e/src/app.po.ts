import { browser, by, element, ElementFinder } from 'protractor';

export class AppPage {
	navigateTo(): Promise<unknown> {
		return browser.get(browser.baseUrl) as Promise<unknown>;
	}

	getTitleText(): Promise<string> {
		return element(by.css('app-root .content span')).getText() as Promise<
			string
		>;
	}

	getToolbarParagraphText(): Promise<string> {
		return element(by.css('app-root app-toolbar p')).getText() as Promise<
			string
		>;
	}

	getEditorComponent(): ElementFinder {
		return element(by.css('app-root app-editor div#editor'));
	}
}
