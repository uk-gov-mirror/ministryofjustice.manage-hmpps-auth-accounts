/** @type {any} */
const MockAdapter = require('axios-mock-adapter')
const querystring = require('querystring')
const { oauthApiFactory } = require('./oauthApi')

const clientId = 'clientId'
const url = 'http://localhost'
const clientSecret = 'clientSecret'

const encodeClientCredentials = () =>
  Buffer.from(`${querystring.escape(clientId)}:${querystring.escape(clientSecret)}`).toString('base64')

const client = {}
const oauthApi = oauthApiFactory(client, { url, clientId, clientSecret })
const mock = new MockAdapter(oauthApi.oauthAxios)
const context = { some: 'context' }

const baseResponse = {
  token_type: 'bearer',
  expires_in: 59,
  scope: 'write',
  internalUser: true,
  jti: 'bf5e8f62-1d2a-4126-96e2-a4ae91997ba6',
}

describe('oathApi tests', () => {
  describe('refresh', () => {
    let refreshResponse
    let requestConfig

    beforeAll(() => {
      // Some hackery to catch the configuration used by axios to make the authentication / refresh request.
      oauthApi.oauthAxios.interceptors.request.use((config) => {
        requestConfig = config
        return config
      })

      mock.reset()
      mock.onAny('oauth/token').reply(200, {
        ...baseResponse,
        access_token: 'newAccessToken',
        refresh_token: 'newRefreshToken',
      })

      refreshResponse = oauthApi.refresh('refreshToken')
    })

    describe('should save tokens', () => {
      it('should save access token', () =>
        refreshResponse.then((response) => {
          expect(response.access_token).toEqual('newAccessToken')
        }))

      it('should save refresh token', () =>
        refreshResponse.then((response) => {
          expect(response.refresh_token).toEqual('newRefreshToken')
        }))
    })

    it('should have set correct request configuration', () =>
      refreshResponse.then((response) => {
        expect(requestConfig.method).toEqual('post')
        expect(requestConfig.baseURL).toEqual(url)
        expect(requestConfig.url).toEqual('/oauth/token')
        expect(requestConfig.data).toEqual('refresh_token=refreshToken&grant_type=refresh_token')
        expect(requestConfig.headers.authorization).toEqual(`Basic ${encodeClientCredentials()}`)
        expect(requestConfig.headers['Content-Type']).toEqual('application/x-www-form-urlencoded')
      }))
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
      actual = oauthApi.userSearch(context, { nameFilter: "joe'fred@bananas%.com", role: '', group: '' })
    })

    it('should return roles from endpoint', () => {
      expect(actual).toEqual(userDetails)
    })
    it('should call user endpoint', () => {
      expect(client.get).toBeCalledWith(
        context,
        "/api/authuser/search?name=joe'fred%40bananas%25.com&groups=&roles=&page=&size="
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
    const user = { user: { firstName: 'joe', lastName: 'smith' } }

    beforeEach(() => {
      client.put = jest.fn().mockReturnValue({
        then: () => {},
      })
      oauthApi.createUser(context, 'joe', user)
    })

    it('should call external user endpoint', () => {
      expect(client.put).toBeCalledWith(context, '/api/authuser/joe', user)
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
