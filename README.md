[![CircleCI](https://circleci.com/gh/ministryofjustice/manage-hmpps-auth-accounts/tree/master.svg?style=svg)](https://circleci.com/gh/ministryofjustice/manage-hmpps-auth-accounts)
[![Known Vulnerabilities](https://snyk.io/test/github/ministryofjustice/manage-hmpps-auth-accounts/badge.svg)](https://snyk.io/test/github/ministryofjustice/manage-hmpps-auth-accounts)

# Manage HMPPS Auth Accounts

The service requires the following minimum tool versions:

- node v10+ 
- Chrome 
- Chromedriver (align the version with chrome version installed on your machine)

(The Gradle wrapper is bundled with the project, currently at version 5.0)

Ensure that you have these installed using your system package manager and/or npm for node. 

# Dependent services when running locally

When running locally this service needs to use several other supporting services which
need to be running and available at known locations.

- Elite2API        port: 8080
- Oauth2 Server    port: 9090

For simplicity, the easiest way to make these services available is to clone the elite2api
repository and to run the docker compose file in the root directory to bring up local 
versions of all three. This starts the services at the above default ports on your
machine.

```
$ docker-compose pull && docker-compose up"  
```

# Running manage-hmpps-auth-accounts locally

The application can be built & run with the following bash commands : 

```
npm install
npm start
```

This will start the service and use the default dependent services as above.

The UI will be available on http://localhost:3001

NPM will use the package.json file in the root of the project to download any required dependencies.
You will need to re-run these commands each time you make a change to ensure that the react application is updated.


# Overriding the Default Environment Settings

When manage-hmpps-auth-accounts runs in non-local environments it requires a set of environment variables to 
tell it where to find the dependent services and other important settings.
The following environment variables supply these values:


| Environment Variable    | Description                                  |
|------------------------ |:--------------------------------------------:|
| API_CLIENT_ID           | Client ID for accessing elite2api            |
| API_CLIENT_SECRET       | Client secret for accessing elite2api        |
| API_ENDPOINT_URL        | URL to the elite2api                         |
| OAUTH_ENDPOINT_URL      | URL to the Oauth2 server                     |
| NN_ENDPOINT_URL         | New Nomis UI                                 |
| SESSION_COOKIE_SECRET   | Session cookie secret                        | 


# Production execution

For a production build run the following within bash :

```
npm run build
node-env mode=PRODUCTION npm start
```

# Running in Docker locally

```
docker run -p 3000:3000 -d \
     --name manage-hmpps-auth-accounts \
     -e USE_API_GATEWAY_AUTH=no \
     quay.io/hmpps/manage-hmpps-auth-accounts:latest
```

# Integration tests

The `manage-accounts-specs` directory contains a set of integration tests for the `manage-hmpps-auth-accounts` application.

The tests are written in the Groovy programming language using a test framework called Spock. 

The tests drive the UI using 'Geb', a Groovy wrapper for Selenium Webdriver and use WireMock to 
stub the application's dependencies on the elite2 and oauth RESTful APIs.

# Running the feature tests

They do not need the dependent services to be running as it uses a special version of the service with wiremocked stubs for these.
Feature tests may be run either from the commandline of from within IntelliJ.
A choice of web browsers can be configured, though Chrome or Chrome headless are configured by default.

* Preparation (do this whether running from commandline or IntelliJ)

   - Download the latest version of ChromeDriver and follow the installation instructions here:
     ```
      https://sites.google.com/a/chromium.org/chromedriver/downloads
      https://sites.google.com/a/chromium.org/chromedriver/getting-started
     ```
   - Check that a chromedriver executable is available on your path
   - Check that the versions of chromedriver and your installed chrome browser match 
   - Check and alter if necessary manage-accounts-specs/build.gradle to set the chrome version to your installed version.
   - Alter the keywork-specs/build.gradle to choose either the 'headless' driver or standard chrome - the latter will display the browser during test execution.

* From the commandline:

   - In one terminal session, from the project root : 

       ```npm run start-feature```

   - In another terminal, from the project root :

       ```./gradlew test```

   - The tests will run and produce reports in `manage-accounts-specs/reports/tests`

   - Choose the Chrome web driver (rather than headless) to see the tests excute in a browser window


* From IntelliJ IDE

  - Ensure that `build.gradle` is linked to the IDE project (See here: https://www.jetbrains.com/help/idea/gradle.html)

  - Ensure that chromedriver` is in your executable PATH (as above)

  - Ensure that your chrome and chromedriver versions match, and are set in the build.gradle file.

  - Open a Spock Specification (`uk.gov.justice.digital.hmpps.manageusers.specs.LoginSpecification` for example). 

  - The IDE gutter should now display the green 'run' icons for both the class and each of its test methods.

  - Click the green run icon to start test


### Useful links

- Spock: http://spockframework.org/
- Geb: http://www.gebish.org/
- Groovy: http://groovy-lang.org/index.html
- Gradle: https://gradle.org/
- WireMock: http://wiremock.org/
- Chromedriver: https://sites.google.com/a/chromium.org/chromedriver
