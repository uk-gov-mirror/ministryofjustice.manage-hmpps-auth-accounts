package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class UserSearchPage extends Page {


    static url = "/maintain-roles"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Search for NOMIS user')
    }

    static content = {
        headingText { $('h1').first().text() }
        searchButton { $('#search-button') }
        backLink { $('a.backlink')}
        roleSelect { $('#role-select')}
        nameFilter { $('#name-Filter')}
        messageBar(required: false) { $('div #messageBar')}
    }

}
