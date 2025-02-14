/** @type {any} */
const nock = require('nock')
const { oauthApiFactory } = require('./oauthApi')

const clientId = 'clientId'
const url = 'http://localhost'
const clientSecret = 'clientSecret'

const client = {}
const oauthApi = oauthApiFactory(client, { url, clientId, clientSecret })
const mock = nock(url, { reqheaders: { 'Content-Type': 'application/x-www-form-urlencoded' } })
const context = { some: 'context' }

describe('oauthApi tests', () => {
  beforeEach(() => {
    nock.cleanAll()
  })

  describe('refresh', () => {
    it('should save access token', async () => {
      mock
        .post('/oauth/token', { grant_type: 'refresh_token', refresh_token: 'refreshToken' })
        .basicAuth({ user: clientId, pass: clientSecret })
        .reply(200, {
          token_type: 'bearer',
          expires_in: 59,
          scope: 'write',
          internalUser: true,
          jti: 'bf5e8f62-1d2a-4126-96e2-a4ae91997ba6',
          access_token: 'newAccessToken',
          refresh_token: 'newRefreshToken',
        })
      const response = await oauthApi.refresh('refreshToken')
      expect(response.access_token).toEqual('newAccessToken')
      expect(response.refresh_token).toEqual('newRefreshToken')
    })
  })

  describe('userRoles', () => {
    const roles = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = jest.fn().mockReturnValue({
        then: () => roles,
      })
      actual = oauthApi.userRoles(context, { username: 'joe' })
    })

    it('should return roles from endpoint', () => {
      expect(actual).toEqual(roles)
    })
    it('should call auth roles endpoint', () => {
      expect(client.get).toBeCalledWith(context, '/api/authuser/joe/roles')
    })
  })

  describe('userGroups', () => {
    const groups = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = jest.fn().mockReturnValue({
        then: () => groups,
      })
      actual = oauthApi.userGroups(context, { username: 'joe' })
    })

    it('should return groups from endpoint', () => {
      expect(actual).toEqual(groups)
    })
    it('should call auth groups endpoint', () => {
      expect(client.get).toBeCalledWith(context, '/api/authuser/joe/groups?children=false')
    })
  })

  describe('getUser', () => {
    const userDetails = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = jest.fn().mockReturnValue({
        then: () => userDetails,
      })
      actual = oauthApi.getUser(context, { username: 'joe' })
    })

    it('should return roles from endpoint', () => {
      expect(actual).toEqual(userDetails)
    })
    it('should call external user endpoint', () => {
      expect(client.get).toBeCalledWith(context, '/api/authuser/joe')
    })
  })

  describe('getUserEmail', () => {
    const emailDetails = { email: 'hello@there', username: 'someuser' }

    beforeEach(() => {
      client.get = jest.fn().mockReturnValue({
        then: () => emailDetails,
      })
    })

    it('should return email from endpoint', async () => {
      const actual = await oauthApi.getUserEmail(context, { username: 'joe' })
      expect(actual).toEqual(emailDetails)
    })
    it('should call user email endpoint', () => {
      oauthApi.getUserEmail(context, { username: 'joe' })
      expect(client.get).toBeCalledWith(context, '/api/user/joe/email')
    })
    it('should cope with not found from endpoint', async () => {
      const error = { ...new Error('User not found'), status: 404 }
      client.get.mockRejectedValue(error)
      const actual = await oauthApi.getUserEmail(context, { username: 'joe' })
      expect(actual).toEqual({})
    })
    it('should rethrow other errors', async () => {
      const error = new Error('User not found')
      client.get.mockRejectedValue(error)
      expect(async () => oauthApi.getUserEmail(context, { username: 'joe' })).rejects.toThrow(error)
    })
  })

  describe('userEmails', () => {
    const emailDetails = [{ email: 'hello@there', username: 'someuser' }]
    let actual

    beforeEach(() => {
      client.post = jest.fn().mockReturnValue({
        then: () => emailDetails,
      })
      actual = oauthApi.userEmails(context, ['joe', 'fred'])
    })

    it('should return email from endpoint', () => {
      expect(actual).toEqual(emailDetails)
    })
    it('should call user emails endpoint', () => {
      expect(client.post).toBeCalledWith(context, '/api/user/email', ['joe', 'fred'])
    })
  })

  describe('currentUser', () => {
    const userDetails = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = jest.fn().mockReturnValue({
        then: () => userDetails,
      })
      actual = oauthApi.currentUser(context)
    })

    it('should return user details from endpoint', () => {
      expect(actual).toEqual(userDetails)
    })
    it('should call user endpoint', () => {
      expect(client.get).toBeCalledWith(context, '/api/user/me')
    })
  })

  describe('currentRoles', () => {
    const roles = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = jest.fn().mockReturnValue({
        then: () => roles,
      })
      actual = oauthApi.currentRoles(context)
    })

    it('should return roles from endpoint', () => {
      expect(actual).toEqual(roles)
    })
    it('should call user endpoint', () => {
      expect(client.get).toBeCalledWith(context, '/api/user/me/roles')
    })
  })
  describe('userSearch', () => {
    const userDetails = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = jest.fn().mockReturnValue({
        then: () => userDetails,
      })
      actual = oauthApi.userSearch(context, { nameFilter: "joe'fred@bananas%.com", role: '', group: '', status: 'ALL' })
    })

    it('should return roles from endpoint', () => {
      expect(actual).toEqual(userDetails)
    })
    it('should call user endpoint', () => {
      expect(client.get).toBeCalledWith(
        context,
        "/api/authuser/search?name=joe'fred%40bananas%25.com&groups=&roles=&status=ALL&page=&size=",
      )
    })
  })

  describe('addUserRoles', () => {
    const errorResponse = { field: 'hello' }
    let actual

    beforeEach(() => {
      client.post = jest.fn().mockReturnValue({
        then: () => errorResponse,
      })
      actual = oauthApi.addUserRoles(context, { username: 'bob', roles: ['maintain'] })
    })

    it('should return any error from endpoint', () => {
      expect(actual).toEqual(errorResponse)
    })
    it('should call user endpoint', () => {
      expect(client.post).toBeCalledWith(context, '/api/authuser/bob/roles', ['maintain'])
    })
  })

  describe('removeUserRole', () => {
    const errorResponse = { field: 'hello' }
    let actual

    beforeEach(() => {
      client.del = jest.fn().mockReturnValue({
        then: () => errorResponse,
      })
      actual = oauthApi.removeUserRole(context, { username: 'bob', role: 'maintain' })
    })

    it('should return any error from endpoint', () => {
      expect(actual).toEqual(errorResponse)
    })
    it('should call user endpoint', () => {
      expect(client.del).toBeCalledWith(context, '/api/authuser/bob/roles/maintain')
    })
  })

  describe('addUserGroup', () => {
    const errorResponse = { field: 'hello' }
    let actual

    beforeEach(() => {
      client.put = jest.fn().mockReturnValue({
        then: () => errorResponse,
      })
      actual = oauthApi.addUserGroup(context, { username: 'bob', group: 'maintain' })
    })

    it('should return any error from endpoint', () => {
      expect(actual).toEqual(errorResponse)
    })
    it('should call user endpoint', () => {
      expect(client.put).toBeCalledWith(context, '/api/authuser/bob/groups/maintain', undefined)
    })
  })

  describe('removeUserGroup', () => {
    const errorResponse = { field: 'hello' }
    let actual

    beforeEach(() => {
      client.del = jest.fn().mockReturnValue({
        then: () => errorResponse,
      })
      actual = oauthApi.removeUserGroup(context, { username: 'bob', group: 'maintain' })
    })

    it('should return any error from endpoint', () => {
      expect(actual).toEqual(errorResponse)
    })
    it('should call user endpoint', () => {
      expect(client.del).toBeCalledWith(context, '/api/authuser/bob/groups/maintain')
    })
  })

  describe('assignableRoles', () => {
    const roles = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = jest.fn().mockReturnValue({
        then: () => roles,
      })
      actual = oauthApi.assignableRoles(context, { username: 'bob' })
    })

    it('should return roles from endpoint', () => {
      expect(actual).toEqual(roles)
    })
    it('should call user endpoint', () => {
      expect(client.get).toBeCalledWith(context, '/api/authuser/bob/assignable-roles')
    })
  })

  describe('assignableGroups', () => {
    const groups = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = jest.fn().mockReturnValue({
        then: () => groups,
      })
      actual = oauthApi.assignableGroups(context)
    })

    it('should return groups from endpoint', () => {
      expect(actual).toEqual(groups)
    })
    it('should call user endpoint', () => {
      expect(client.get).toBeCalledWith(context, '/api/authuser/me/assignable-groups')
    })
  })

  describe('createUser', () => {
    const user = { user: { email: 'joe@digital.justice.gov.uk', firstName: 'joe', lastName: 'smith' } }

    beforeEach(() => {
      client.post = jest.fn().mockReturnValue({
        then: () => {},
      })
      oauthApi.createUser(context, user)
    })

    it('should call external user endpoint', () => {
      expect(client.post).toBeCalledWith(context, '/api/authuser/create', user)
    })
  })

  describe('enableUser', () => {
    const errorResponse = { field: 'hello' }
    let actual

    beforeEach(() => {
      client.put = jest.fn().mockReturnValue({
        then: () => errorResponse,
      })
      actual = oauthApi.enableUser(context, { username: 'bob' })
    })

    it('should return any error from endpoint', () => {
      expect(actual).toEqual(errorResponse)
    })
    it('should call user endpoint', () => {
      expect(client.put).toBeCalledWith(context, '/api/authuser/bob/enable', undefined)
    })
  })

  describe('disableUser', () => {
    const errorResponse = { field: 'hello' }
    let actual

    beforeEach(() => {
      client.put = jest.fn().mockReturnValue({
        then: () => errorResponse,
      })
      actual = oauthApi.disableUser(context, { username: 'bob' })
    })

    it('should return any error from endpoint', () => {
      expect(actual).toEqual(errorResponse)
    })
    it('should call user endpoint', () => {
      expect(client.put).toBeCalledWith(context, '/api/authuser/bob/disable', undefined)
    })
  })

  describe('groupDetails', () => {
    const groups = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = jest.fn().mockReturnValue({
        then: () => groups,
      })
      actual = oauthApi.groupDetails(context, { group: 'group1' })
    })

    it('should return groups from endpoint', () => {
      expect(actual).toEqual(groups)
    })
    it('should call user endpoint', () => {
      expect(client.get).toBeCalledWith(context, '/api/groups/group1')
    })
  })

  describe('change group name', () => {
    const groupName = { groupName: 'groupie' }

    beforeEach(() => {
      client.put = jest.fn().mockReturnValue({
        then: () => {},
      })
      oauthApi.changeGroupName(context, 'group1', groupName)
    })

    it('should call external user endpoint', () => {
      expect(client.put).toBeCalledWith(context, '/api/groups/group1', groupName)
    })
  })

  describe('childGroupDetails', () => {
    const groups = { bob: 'hello there' }
    let actual

    beforeEach(() => {
      client.get = jest.fn().mockReturnValue({
        then: () => groups,
      })
      actual = oauthApi.childGroupDetails(context, { group: 'childgroup1' })
    })

    it('should return groups from endpoint', () => {
      expect(actual).toEqual(groups)
    })
    it('should call user endpoint', () => {
      expect(client.get).toBeCalledWith(context, '/api/groups/child/childgroup1')
    })
  })

  describe('change child group name', () => {
    const groupName = { groupName: 'groupie' }

    beforeEach(() => {
      client.put = jest.fn().mockReturnValue({
        then: () => {},
      })
      oauthApi.changeChildGroupName(context, 'childgroup1', groupName)
    })

    it('should call external user endpoint', () => {
      expect(client.put).toBeCalledWith(context, '/api/groups/child/childgroup1', groupName)
    })
  })
})
