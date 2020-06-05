package uk.gov.justice.digital.hmpps.manageusers.mockapis.mockResponses


class UserSearchResponse {

    static response = '''
[
    {
        "staffId": 485576,
        "username": "KBECK",
        "firstName": "KAREN",
        "lastName": "BECK",
        "active": false,
        "activeCaseLoadId": "LEI",
        "accountStatus": "MAT",
        "lockedFlag": false,
        "expiredFlag": false
    },
    {
        "staffId": 485577,
        "username": "API_TEST_USER",
        "firstName": "ABS",
        "lastName": "DEY",
        "active": false,
        "accountStatus": "SICK",
        "lockedFlag": false,
        "expiredFlag": false
    },
    {
        "staffId": 485636,
        "username": "JDUCKETT_GEN",
        "firstName": "JENNY",
        "lastName": "DUCKETT",
        "active": true,
        "activeCaseLoadId": "LEI",
        "accountStatus": "ACTIVE",
        "lockedFlag": false,
        "expiredFlag": false
    },
    {
        "staffId": 485638,
        "username": "CHANES",
        "firstName": "CHRIS",
        "lastName": "HANES",
        "active": true,
        "activeCaseLoadId": "LEI",
        "accountStatus": "ACTIVE",        
        "lockedFlag": false,
        "expiredFlag": false
    },
    {
        "staffId": 70029,
        "username": "HQA63K",
        "firstName": "MARTHA",
        "lastName": "HUNSTON",
        "active": true,
        "activeCaseLoadId": "LEI",
        "accountStatus": "ACTIVE",
        "lockedFlag": false,
        "expiredFlag": false
    },
    {
        "staffId": 485573,
        "username": "AKNIGHT_GEN",
        "firstName": "ANDREW",
        "lastName": "KNIGHT",
        "active": false,
        "activeCaseLoadId": "LEI",
        "accountStatus": "SUS",      
        "lockedFlag": false,
        "expiredFlag": false
    }
]
'''


    static pagedResponse(int page) {
        return """
[
    {
        "staffId": 485576,
        "username": "user${page}",
        "firstName": "KAREN",
        "lastName": "BECK",
        "active": true,
        "activeCaseLoadId": "BXI",
        "accountStatus": "ACTIVE",
        "lockedFlag": false,
        "expiredFlag": false
    },
    {
        "staffId": 485577,
        "username": "ADEY",
        "firstName": "ABS",
        "lastName": "DEY",
        "active": false,
        "accountStatus": "INACT",
        "lockedFlag": false,
        "expiredFlag": false
    },
    {
        "staffId": 485577,
        "username": "API_TEST_USER",
        "firstName": "ABS",
        "lastName": "DEY",
        "active": true,
        "activeCaseLoadId": "LEI",
        "accountStatus": "ACTIVE",
        "lockedFlag": false,
        "expiredFlag": false
    }
]
"""
    }
}