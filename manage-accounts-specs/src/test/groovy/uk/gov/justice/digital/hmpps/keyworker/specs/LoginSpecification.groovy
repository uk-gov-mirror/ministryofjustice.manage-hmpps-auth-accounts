package uk.gov.justice.digital.hmpps.keyworker.specs


import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api

import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.pages.AdminUtilitiesPage

import uk.gov.justice.digital.hmpps.keyworker.pages.LoginPage

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class LoginSpecification extends BrowserReportingSpec {

    @Rule
    OauthApi oauthApi = new OauthApi()

    @Rule
    Elite2Api elite2Api = new Elite2Api()

    TestFixture fixture = new TestFixture(browser, elite2Api, oauthApi)

    def "The login page is present"() {
        given:
        oauthApi.stubAuthorizeRequest()

        when: 'I go to the login page'
        to LoginPage

        then: 'The Login page is displayed'
        at LoginPage
    }

    def "Default URI redirects to Login page"() {
        given:
        oauthApi.stubAuthorizeRequest()

        when: "I go to the website URL using an empty path"
        go '/'

        then: 'The Login page is displayed'
        at LoginPage
    }


    def "Log out"() {
        given: "I have logged in"
        fixture.loginAs ITAG_USER

        when: "I log out"
        oauthApi.stubLogout()
        header.logout()

        then: "I am returned to the Login page."
        at LoginPage
    }
}
