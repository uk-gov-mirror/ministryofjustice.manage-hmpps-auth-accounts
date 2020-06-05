package uk.gov.justice.digital.hmpps.manageusers.pages

public class AuthUserSearchResultsPage extends AuthUserSearchPage {
    static url = "/maintain-auth-users/search-results"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Search for auth user results')
    }

    static content = {
        headingText { $('h1').first().text() }
        searchButton { $('#search-button') }
        user { $('#user') }
        rows(required: false) { $('table tbody tr') }
        errorSummary(required: false) { $('#error-summary') }
    }
}