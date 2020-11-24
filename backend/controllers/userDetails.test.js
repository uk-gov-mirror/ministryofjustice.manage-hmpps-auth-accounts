const { userDetailsFactory } = require('./userDetails')

describe('user detail factory', () => {
  const getUserRolesAndGroupsApi = jest.fn()
  const removeRoleApi = jest.fn()
  const removeGroupApi = jest.fn()
  const enableUserApi = jest.fn()
  const disableUserApi = jest.fn()
  const logError = jest.fn()
  const userDetails = userDetailsFactory(
    getUserRolesAndGroupsApi,
    removeRoleApi,
    removeGroupApi,
    enableUserApi,
    disableUserApi,
    '/maintain-auth-users',
    '/manage-auth-users',
    'Maintain auth users',
    logError
  )

  it('should call userDetail render', async () => {
    const req = { params: { username: 'joe' }, flash: jest.fn() }
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
    await userDetails.index(req, { render })
    expect(render).toBeCalledWith('userDetails.njk', {
      maintainTitle: 'Maintain auth users',
      maintainUrl: '/maintain-auth-users',
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
      staffUrl: '/manage-auth-users/joe',
      roles: [{ roleName: 'roleName1', roleCode: 'roleCode1' }],
      groups: [{ groupName: 'groupName2', groupCode: 'groupCode2' }],
      errors: undefined,
    })
  })

  describe('remove role', () => {
    it('should remove role and redirect', async () => {
      const req = { params: { username: 'joe', role: 'role1' } }

      const redirect = jest.fn()
      const locals = jest.fn()
      await userDetails.removeRole(req, { redirect, locals })
      expect(redirect).toBeCalledWith('/manage-auth-users/joe')
      expect(removeRoleApi).toBeCalledWith(locals, 'joe', 'role1')
    })

    it('should call error on failure', async () => {
      const render = jest.fn()
      removeRoleApi.mockRejectedValue(new Error('This failed'))
      await userDetails.removeRole({ params: { username: 'joe', role: 'role19' } }, { render })
      expect(render).toBeCalledWith('error.njk', { url: '/manage-auth-users/joe' })
    })

    it('should ignore if user does not have role', async () => {
      const redirect = jest.fn()
      const error = new Error('This failed')
      // @ts-ignore
      error.status = 400
      removeRoleApi.mockRejectedValue(error)
      await userDetails.removeRole(
        {
          params: { username: 'joe', role: 'role99' },
          originalUrl: '/some-location',
        },
        { redirect }
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
      expect(redirect).toBeCalledWith('/manage-auth-users/joe')
      expect(removeGroupApi).toBeCalledWith(locals, 'joe', 'group1')
    })

    it('should call error on failure', async () => {
      const render = jest.fn()
      removeGroupApi.mockRejectedValue(new Error('This failed'))
      await userDetails.removeGroup({ params: { username: 'joe', role: 'group19' } }, { render })
      expect(render).toBeCalledWith('error.njk', { url: '/manage-auth-users/joe' })
    })

    it('should ignore if user does not have group', async () => {
      const redirect = jest.fn()
      const error = new Error('This failed')
      // @ts-ignore
      error.status = 400
      removeGroupApi.mockRejectedValue(error)
      await userDetails.removeRole(
        {
          params: { username: 'joe', role: 'group99' },
          originalUrl: '/some-location',
        },
        { redirect }
      )
      expect(redirect).toBeCalledWith('/some-location')
    })
  })

  describe('enable user', () => {
    it('should enable user and redirect', async () => {
      const req = { params: { username: 'joe' } }

      const redirect = jest.fn()
      const locals = jest.fn()
      await userDetails.enableUser(req, { redirect, locals })
      expect(redirect).toBeCalledWith('/manage-auth-users/joe')
      expect(enableUserApi).toBeCalledWith(locals, 'joe')
    })

    it('should call error on failure', async () => {
      const render = jest.fn()
      enableUserApi.mockRejectedValue(new Error('This failed'))
      await userDetails.enableUser({ params: { username: 'joe' } }, { render })
      expect(render).toBeCalledWith('error.njk', { url: '/manage-auth-users/joe' })
    })
  })

  describe('disable user', () => {
    it('should disable user and redirect', async () => {
      const req = { params: { username: 'joe' } }

      const redirect = jest.fn()
      const locals = jest.fn()
      await userDetails.disableUser(req, { redirect, locals })
      expect(redirect).toBeCalledWith('/manage-auth-users/joe')
      expect(disableUserApi).toBeCalledWith(locals, 'joe')
    })

    it('should call error on failure', async () => {
      const render = jest.fn()
      removeGroupApi.mockRejectedValue(new Error('This failed'))
      await userDetails.disableUser({ params: { username: 'joe' } }, { render })
      expect(render).toBeCalledWith('error.njk', { url: '/manage-auth-users/joe' })
    })
  })
})