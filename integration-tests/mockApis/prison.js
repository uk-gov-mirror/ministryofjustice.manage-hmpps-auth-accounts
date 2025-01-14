const { stubFor, getFor, getMatchingRequests } = require('./wiremock')

const replicateUser = (times) =>
  [...Array(times).keys()].map((i) => ({
    username: `ITAG_USER${i}`,
    active: i % 2 === 0,
    firstName: 'Itag',
    lastName: `User${i}`,
    activeCaseLoadId: 'BXI',
  }))

module.exports = {
  stubHealth: (status = 200) => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: '/health/ping',
      },
      response: {
        status,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        fixedDelayMilliseconds: status === 500 ? 5000 : '',
      },
    })
  },

  stubUserCaseloads: (caseloads) =>
    getFor({
      urlPath: '/api/users/me/caseLoads',
      body: caseloads || [
        {
          caseLoadId: 'MDI',
          description: 'Moorland',
          currentlyActive: true,
        },
      ],
    }),
  stubGetRoles: ({
    content = [
      {
        roleCode: 'MAINTAIN_ACCESS_ROLES',
        roleName: 'Maintain Roles',
      },
      {
        roleCode: 'USER_ADMIN',
        roleName: 'User Admin',
      },
    ],
  }) =>
    getFor({
      urlPath: '/api/access-roles',
      body: content,
    }),
  stubGetRolesIncludingAdminRoles: () =>
    getFor({
      urlPattern: '/api/access-roles\\?includeAdmin=true',
      body: [
        {
          roleCode: 'MAINTAIN_ACCESS_ROLES',
          roleName: 'Maintain Roles',
          roleFunction: 'GENERAL',
        },
        {
          roleCode: 'USER_ADMIN',
          roleName: 'User Admin',
          roleFunction: 'ADMIN',
        },
        {
          roleCode: 'ANOTHER_ADMIN_ROLE',
          roleName: 'Another admin role',
          roleFunction: 'ADMIN',
        },
        {
          roleCode: 'ANOTHER_GENERAL_ROLE',
          roleName: 'Another general role',
          roleFunction: 'GENERAL',
        },
      ],
    }),
  stubDpsSearch: ({ totalElements = 1, page = 0, size = 10 }) =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/api/users/local-administrator/available',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'total-records': `${totalElements}`,
          'page-offset': `${page * size}`,
          'page-limit': `${size}`,
        },
        jsonBody: replicateUser(Math.floor(totalElements / size) === page ? totalElements % size : size),
      },
    }),
  stubDpsAdminSearch: ({ totalElements = 1, page = 0, size = 10 }) =>
    stubFor({
      request: {
        method: 'GET',
        urlPath: '/api/users',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'total-records': `${totalElements}`,
          'page-offset': `${page * size}`,
          'page-limit': `${size}`,
        },
        jsonBody: replicateUser(Math.floor(totalElements / size) === page ? totalElements % size : size),
      },
    }),
  stubUserDetails: () =>
    getFor({
      urlPattern: '/api/users/.*',
      body: {
        staffId: '12345',
        username: 'ITAG_USER',
        firstName: 'Itag',
        lastName: 'User',
      },
    }),
  stubUserGetRoles: () =>
    getFor({
      urlPattern: '/api/users/.*/access-roles/caseload/NWEB.*',
      body: [
        {
          roleCode: 'MAINTAIN_ACCESS_ROLES',
          roleName: 'Maintain Roles',
          roleFunction: 'GENERAL',
        },
        {
          roleCode: 'ANOTHER_GENERAL_ROLE',
          roleName: 'Another general role',
          roleFunction: 'GENERAL',
        },
      ],
    }),
  stubDpsAddRoles: () =>
    stubFor({
      request: {
        method: 'POST',
        urlPattern: '/api/users/.*/access-role',
      },
      response: { status: 200 },
    }),
  stubDpsRemoveRole: () =>
    stubFor({
      request: {
        method: 'DELETE',
        urlPattern: '/api/users/.*/caseload/NWEB/access-role/.*',
      },
      response: { status: 200 },
    }),
  verifyDpsSearch: () =>
    getMatchingRequests({
      method: 'GET',
      urlPathPattern: '/api/users/local-administrator/available',
    }).then((data) => data.body.requests),
  verifyDpsAddRoles: () =>
    getMatchingRequests({
      method: 'POST',
      urlPathPattern: '/api/users/.*/access-role',
    }).then((data) => data.body.requests),
  verifyDpsRemoveRole: () =>
    getMatchingRequests({
      method: 'DELETE',
      urlPathPattern: '/api/users/.*/caseload/NWEB/access-role/.*',
    }).then((data) => data.body.requests),
}
