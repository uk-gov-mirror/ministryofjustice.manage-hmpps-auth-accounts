const { userDetailsFactory } = require('./userDetails')

describe('user detail factory', () => {
  const getUserRolesAndGroupsApi = jest.fn()
  const removeRoleApi = jest.fn()
  const removeGroupApi = jest.fn()
  const enableUserApi = jest.fn()
  const disableUserApi = jest.fn()
  const userDetails = userDetailsFactory(
    getUserRolesAndGroupsApi,
    removeRoleApi,
    removeGroupApi,
    enableUserApi,
    disableUserApi,
    '/search-external-users',
    '/manage-external-users',
    'Search for an external user',
    true,
  )

  it('should call userDetail render', async () => {
    const req = { params: { username: 'joe' }, flash: jest.fn(), session: {} }
    getUserRolesAndGroupsApi.mockResolvedValue([
      {
        username: 'BOB',
        firstName: 'Billy',
        lastName: 'Bob',
        email: 'bob@digital.justice.gov.uk',
        enabled: true,
        verified: true,
        lastLoggedIn: '2020-11-23T11:13:08.387065',
      },
      [{ roleName: 'roleName1', roleCode: 'roleCode1' }],
      [{ groupName: 'groupName2', groupCode: 'groupCode2', showRemove: true }],
    ])
    const render = jest.fn()
    await userDetails.index(req, { render })
    expect(render).toBeCalledWith('userDetails.njk', {
      searchTitle: 'Search for an external user',
      searchResultsUrl: '/search-external-users/results',
      searchUrl: '/search-external-users',
      staff: {
        firstName: 'Billy',
        lastName: 'Bob',
        name: 'Billy Bob',
        username: 'BOB',
        email: 'bob@digital.justice.gov.uk',
        enabled: true,
        verified: true,
        lastLoggedIn: '2020-11-23T11:13:08.387065',
      },
      staffUrl: '/manage-external-users/joe',
      roles: [{ roleName: 'roleName1', roleCode: 'roleCode1' }],
      groups: [{ groupName: 'groupName2', groupCode: 'groupCode2', showRemove: true }],
      hasMaintainAuthUsers: false,
      showEnableDisable: true,
      showExtraUserDetails: true,
      showGroups: true,
      showUsername: true,
      errors: undefined,
    })
  })

  it('should set showUsername to false if email same as username', async () => {
    const req = { params: { username: 'joe' }, flash: jest.fn(), session: {} }
    getUserRolesAndGroupsApi.mockResolvedValue([
      {
        username: 'BOB@DIGITAL.JUSTICE.GOV.UK',
        firstName: 'Billy',
        lastName: 'Bob',
        email: 'bob@digital.justice.gov.uk',
        enabled: true,
        verified: true,
        lastLoggedIn: '2020-11-23T11:13:08.387065',
      },
      [{ roleName: 'roleName1', roleCode: 'roleCode1' }],
      [{ groupName: 'groupName2', groupCode: 'groupCode2', showRemove: true }],
    ])
    const render = jest.fn()
    await userDetails.index(req, { render })
    expect(render).toBeCalledWith('userDetails.njk', {
      searchTitle: 'Search for an external user',
      searchResultsUrl: '/search-external-users/results',
      searchUrl: '/search-external-users',
      staff: {
        firstName: 'Billy',
        lastName: 'Bob',
        name: 'Billy Bob',
        username: 'BOB@DIGITAL.JUSTICE.GOV.UK',
        email: 'bob@digital.justice.gov.uk',
        enabled: true,
        verified: true,
        lastLoggedIn: '2020-11-23T11:13:08.387065',
      },
      staffUrl: '/manage-external-users/joe',
      roles: [{ roleName: 'roleName1', roleCode: 'roleCode1' }],
      groups: [{ groupName: 'groupName2', groupCode: 'groupCode2', showRemove: true }],
      hasMaintainAuthUsers: false,
      showEnableDisable: true,
      showExtraUserDetails: true,
      showGroups: true,
      showUsername: false,
      errors: undefined,
    })
  })

  it('should only have groups set to showRemove when group manager is member of group', async () => {
    const req = { params: { username: 'joe' }, flash: jest.fn(), session: {} }
    getUserRolesAndGroupsApi.mockResolvedValue([
      {
        username: 'BOB@DIGITAL.JUSTICE.GOV.UK',
        firstName: 'Billy',
        lastName: 'Bob',
        email: 'bob@digital.justice.gov.uk',
        enabled: true,
        verified: true,
        lastLoggedIn: '2020-11-23T11:13:08.387065',
      },
      [{ roleName: 'roleName1', roleCode: 'roleCode1' }],
      [
        { groupName: 'groupName2', groupCode: 'groupCode2', showRemove: true },
        { groupName: 'groupName3', groupCode: 'groupCode3', showRemove: false },
      ],
    ])
    const render = jest.fn()
    await userDetails.index(req, { render })
    expect(render).toBeCalledWith('userDetails.njk', {
      searchTitle: 'Search for an external user',
      searchResultsUrl: '/search-external-users/results',
      searchUrl: '/search-external-users',
      staff: {
        firstName: 'Billy',
        lastName: 'Bob',
        name: 'Billy Bob',
        username: 'BOB@DIGITAL.JUSTICE.GOV.UK',
        email: 'bob@digital.justice.gov.uk',
        enabled: true,
        verified: true,
        lastLoggedIn: '2020-11-23T11:13:08.387065',
      },
      staffUrl: '/manage-external-users/joe',
      roles: [{ roleName: 'roleName1', roleCode: 'roleCode1' }],
      groups: [
        { groupName: 'groupName2', groupCode: 'groupCode2', showRemove: true },
        { groupName: 'groupName3', groupCode: 'groupCode3', showRemove: false },
      ],
      hasMaintainAuthUsers: false,
      showEnableDisable: true,
      showExtraUserDetails: true,
      showGroups: true,
      showUsername: false,
      errors: undefined,
    })
  })

  it('should pass through hasMaintainAuthUsers to userDetail render', async () => {
    const req = { params: { username: 'joe' }, flash: jest.fn(), session: {} }
    getUserRolesAndGroupsApi.mockResolvedValue([
      {
        username: 'BOB',
        firstName: 'Billy',
        lastName: 'Bob',
        email: 'bob@digital.justice.gov.uk',
        enabled: true,
        verified: true,
        lastLoggedIn: '2020-11-23T11:13:08.387065',
      },
      [{ roleName: 'roleName1', roleCode: 'roleCode1' }],
      [{ groupName: 'groupName2', groupCode: 'groupCode2', showRemove: true }],
    ])
    const render = jest.fn()
    await userDetails.index(req, { render, locals: { user: { maintainAuthUsers: true } } })
    expect(render).toBeCalledWith('userDetails.njk', {
      searchTitle: 'Search for an external user',
      searchResultsUrl: '/search-external-users/results',
      searchUrl: '/search-external-users',
      staff: {
        firstName: 'Billy',
        lastName: 'Bob',
        name: 'Billy Bob',
        username: 'BOB',
        email: 'bob@digital.justice.gov.uk',
        enabled: true,
        verified: true,
        lastLoggedIn: '2020-11-23T11:13:08.387065',
      },
      staffUrl: '/manage-external-users/joe',
      roles: [{ roleName: 'roleName1', roleCode: 'roleCode1' }],
      groups: [{ groupName: 'groupName2', groupCode: 'groupCode2', showRemove: true }],
      hasMaintainAuthUsers: true,
      showEnableDisable: true,
      showExtraUserDetails: true,
      showGroups: true,
      showUsername: true,
      errors: undefined,
    })
  })

  it('should pass through show fields if not set', async () => {
    const req = { params: { username: 'joe' }, flash: jest.fn(), session: {} }
    const dpsUserDetails = userDetailsFactory(
      getUserRolesAndGroupsApi,
      removeRoleApi,
      undefined,
      undefined,
      undefined,
      '/search-external-users',
      '/manage-external-users',
      'Search for an external user',
      false,
    )
    getUserRolesAndGroupsApi.mockResolvedValue([
      {
        username: 'BOB',
        firstName: 'Billy',
        lastName: 'Bob',
        email: 'bob@digital.justice.gov.uk',
        enabled: true,
        verified: true,
        lastLoggedIn: '2020-11-23T11:13:08.387065',
      },
      [{ roleName: 'roleName1', roleCode: 'roleCode1' }],
      [{ groupName: 'groupName2', groupCode: 'groupCode2' }],
    ])
    const render = jest.fn()
    await dpsUserDetails.index(req, { render })
    expect(render).toBeCalledWith('userDetails.njk', {
      searchTitle: 'Search for an external user',
      searchResultsUrl: '/search-external-users/results',
      searchUrl: '/search-external-users',
      staff: {
        firstName: 'Billy',
        lastName: 'Bob',
        name: 'Billy Bob',
        username: 'BOB',
        email: 'bob@digital.justice.gov.uk',
        enabled: true,
        verified: true,
        lastLoggedIn: '2020-11-23T11:13:08.387065',
      },
      staffUrl: '/manage-external-users/joe',
      roles: [{ roleName: 'roleName1', roleCode: 'roleCode1' }],
      groups: [{ groupName: 'groupName2', groupCode: 'groupCode2' }],
      hasMaintainAuthUsers: false,
      showEnableDisable: false,
      showExtraUserDetails: false,
      showGroups: false,
      showUsername: true,
      errors: undefined,
    })
  })

  it('should copy the search results url through from the session', async () => {
    const req = { params: { username: 'joe' }, flash: jest.fn(), session: { searchResultsUrl: '/some-url' } }
    const dpsUserDetails = userDetailsFactory(
      getUserRolesAndGroupsApi,
      removeRoleApi,
      undefined,
      undefined,
      undefined,
      '/search-external-users',
      '/manage-external-users',
      'Search for an external user',
      false,
    )
    getUserRolesAndGroupsApi.mockResolvedValue([
      {
        username: 'BOB',
        firstName: 'Billy',
        lastName: 'Bob',
        email: 'bob@digital.justice.gov.uk',
        enabled: true,
        verified: true,
        lastLoggedIn: '2020-11-23T11:13:08.387065',
      },
      [{ roleName: 'roleName1', roleCode: 'roleCode1' }],
      [{ groupName: 'groupName2', groupCode: 'groupCode2' }],
    ])
    const render = jest.fn()
    await dpsUserDetails.index(req, { render })
    expect(render).toBeCalledWith('userDetails.njk', {
      searchTitle: 'Search for an external user',
      searchUrl: '/search-external-users',
      searchResultsUrl: '/some-url',
      staff: {
        firstName: 'Billy',
        lastName: 'Bob',
        name: 'Billy Bob',
        username: 'BOB',
        email: 'bob@digital.justice.gov.uk',
        enabled: true,
        verified: true,
        lastLoggedIn: '2020-11-23T11:13:08.387065',
      },
      staffUrl: '/manage-external-users/joe',
      roles: [{ roleName: 'roleName1', roleCode: 'roleCode1' }],
      groups: [{ groupName: 'groupName2', groupCode: 'groupCode2' }],
      hasMaintainAuthUsers: false,
      showEnableDisable: false,
      showExtraUserDetails: false,
      showGroups: false,
      showUsername: true,
      errors: undefined,
    })
  })

  it('should call getUserRolesAndGroupsApi with maintain admin flag set to false', async () => {
    const req = { params: { username: 'joe' }, flash: jest.fn(), session: {} }
    getUserRolesAndGroupsApi.mockResolvedValue([
      {
        username: 'BOB',
        firstName: 'Billy',
        lastName: 'Bob',
        email: 'bob@digital.justice.gov.uk',
        enabled: true,
        verified: true,
        lastLoggedIn: '2020-11-23T11:13:08.387065',
      },
      [{ roleName: 'roleName1', roleCode: 'roleCode1' }],
      [{ groupName: 'groupName2', groupCode: 'groupCode2', showRemove: true }],
    ])
    const locals = { user: { maintainAuthUsers: true } }
    await userDetails.index(req, { render: jest.fn(), locals })
    expect(getUserRolesAndGroupsApi).toBeCalledWith(locals, 'joe', false, true)
  })

  it('should call getUserRolesAndGroupsApi with maintain admin flag set to true', async () => {
    const req = { params: { username: 'joe' }, flash: jest.fn(), session: {} }
    getUserRolesAndGroupsApi.mockResolvedValue([
      {
        username: 'BOB',
        firstName: 'Billy',
        lastName: 'Bob',
        email: 'bob@digital.justice.gov.uk',
        enabled: true,
        verified: true,
        lastLoggedIn: '2020-11-23T11:13:08.387065',
      },
      [{ roleName: 'roleName1', roleCode: 'roleCode1' }],
      [{ groupName: 'groupName2', groupCode: 'groupCode2', showRemove: true }],
    ])
    const locals = { user: { maintainAccessAdmin: true } }
    await userDetails.index(req, { render: jest.fn(), locals })
    expect(getUserRolesAndGroupsApi).toBeCalledWith(locals, 'joe', true, false)
  })

  describe('remove role', () => {
    it('should remove role and redirect', async () => {
      const req = { params: { username: 'joe', role: 'role1' } }

      const redirect = jest.fn()
      const locals = jest.fn()
      await userDetails.removeRole(req, { redirect, locals })
      expect(redirect).toBeCalledWith('/manage-external-users/joe/details')
      expect(removeRoleApi).toBeCalledWith(locals, 'joe', 'role1')
    })

    it('should ignore if user does not have role', async () => {
      const redirect = jest.fn()
      const error = { ...new Error('This failed'), status: 400 }
      removeRoleApi.mockRejectedValue(error)
      await userDetails.removeRole(
        {
          params: { username: 'joe', role: 'role99' },
          originalUrl: '/some-location',
        },
        { redirect },
      )
      expect(redirect).toBeCalledWith('/some-location')
    })
  })

  describe('remove group', () => {
    it('should remove group and redirect', async () => {
      const req = { params: { username: 'joe', group: 'group1' } }

      const redirect = jest.fn()
      const locals = jest.fn()
      await userDetails.removeGroup(req, { redirect, locals })
      expect(redirect).toBeCalledWith('/manage-external-users/joe/details')
      expect(removeGroupApi).toBeCalledWith(locals, 'joe', 'group1')
    })

    it('should ignore if user does not have group', async () => {
      const redirect = jest.fn()
      const error = { ...new Error('This failed'), status: 400 }
      removeGroupApi.mockRejectedValue(error)
      await userDetails.removeRole(
        {
          params: { username: 'joe', role: 'group99' },
          originalUrl: '/some-location',
        },
        { redirect },
      )
      expect(redirect).toBeCalledWith('/some-location')
    })

    it('should if group Manager tries to delete users last group', async () => {
      const redirect = jest.fn()
      const error = { ...new Error('This failed'), status: 403 }
      removeGroupApi.mockRejectedValue(error)
      await userDetails.removeRole(
        {
          params: { username: 'joe', role: 'group99' },
          originalUrl: '/some-location',
        },
        { redirect },
      )
      expect(redirect).toBeCalledWith('/some-location')
    })

    it('should copy any flash errors over', async () => {
      const req = {
        params: { username: 'joe' },
        flash: jest.fn().mockReturnValue({ error: 'some error' }),
        session: {},
      }
      getUserRolesAndGroupsApi.mockResolvedValue([
        {
          username: 'BOB',
          firstName: 'Billy',
          lastName: 'Bob',
          email: 'bob@digital.justice.gov.uk',
          enabled: true,
          verified: true,
          lastLoggedIn: '2020-11-23T11:13:08.387065',
        },
        [{ roleName: 'roleName1', roleCode: 'roleCode1' }],
        [{ groupName: 'groupName2', groupCode: 'groupCode2', showRemove: true }],
      ])

      const render = jest.fn()
      await userDetails.index(req, { render })
      expect(render).toBeCalledWith('userDetails.njk', {
        searchTitle: 'Search for an external user',
        searchResultsUrl: '/search-external-users/results',
        searchUrl: '/search-external-users',
        staff: {
          firstName: 'Billy',
          lastName: 'Bob',
          name: 'Billy Bob',
          username: 'BOB',
          email: 'bob@digital.justice.gov.uk',
          enabled: true,
          verified: true,
          lastLoggedIn: '2020-11-23T11:13:08.387065',
        },
        staffUrl: '/manage-external-users/joe',
        roles: [{ roleName: 'roleName1', roleCode: 'roleCode1' }],
        groups: [{ groupName: 'groupName2', groupCode: 'groupCode2', showRemove: true }],
        hasMaintainAuthUsers: false,
        showEnableDisable: true,
        showExtraUserDetails: true,
        showGroups: true,
        showUsername: true,
        errors: { error: 'some error' },
      })
    })
  })

  describe('enable user', () => {
    it('should enable user and redirect', async () => {
      const req = { params: { username: 'joe' } }

      const redirect = jest.fn()
      const locals = jest.fn()
      await userDetails.enableUser(req, { redirect, locals })
      expect(redirect).toBeCalledWith('/manage-external-users/joe/details')
      expect(enableUserApi).toBeCalledWith(locals, 'joe')
    })
  })

  describe('disable user', () => {
    it('should disable user and redirect', async () => {
      const req = { params: { username: 'joe' } }

      const redirect = jest.fn()
      const locals = jest.fn()
      await userDetails.disableUser(req, { redirect, locals })
      expect(redirect).toBeCalledWith('/manage-external-users/joe/details')
      expect(disableUserApi).toBeCalledWith(locals, 'joe')
    })
  })
})
