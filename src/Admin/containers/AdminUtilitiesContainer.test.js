import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { AdminUtilitiesContainer } from './AdminUtilitiesContainer'

const props = {
  setLoadedDispatch: jest.fn(),
  user: {
    maintainAccessAdmin: false,
    activeCaseLoadId: '',
    caseLoadOptions: [],
    expiredFlag: false,
    firstName: 'Test',
    lastName: 'User',
    lockedFlag: false,
    maintainAccess: false,
    migration: false,
    staffId: 1,
    username: 'TestUser',
    writeAccess: true,
  },
  config: {
    keyworkerDashboardStatsEnabled: false,
    keyworkerProfileStatsEnabled: 'false',
    mailTo: 'email@test.com',
    notmEndpointUrl: '//notm.url',
    prisonStaffHubUrl: '//psh.url',
  },
  message: '',
}

describe('<AdminUtilitiesContainer />', () => {
  it('render with a message if there are no admin rights', () => {
    const wrapper = shallow(<AdminUtilitiesContainer {...props} />)

    expect(wrapper.find('p').text()).toEqual('There are no admin or utility functions associated with your account.')
  })

  describe('render links', () => {
    it('should render a Link to Maintain Roles Admin section if user has maintain access role', () => {
      props.user.maintainAccess = true
      const wrapper = shallow(<AdminUtilitiesContainer {...props} />)
      const manageRolesLink = wrapper.find('Link').find({ to: '/maintain-roles' })

      expect(manageRolesLink.prop('children')).toEqual('Manage NOMIS user roles')
    })

    it('should render a Link to Manage key worker settings if user has migration and maintain access roles', () => {
      props.user.maintainAccess = true
      props.user.migration = true
      const wrapper = shallow(<AdminUtilitiesContainer {...props} />)
      const keyworkerSettingsLink = wrapper.find('Link').find({ to: '/manage-key-worker-settings' })

      expect(keyworkerSettingsLink.prop('children')).toEqual('Manage key worker settings')
    })

    it('should render a Link to Maintain auth users if user has maintain auth user roles', () => {
      props.user.maintainAuthUsers = true
      const wrapper = shallow(<AdminUtilitiesContainer {...props} />)
      const keyworkerSettingsLink = wrapper.find('Link').find({ to: '/maintain-auth-users' })

      expect(keyworkerSettingsLink.prop('children')).toEqual('Manage auth users')
    })

    it('should render a Link to Maintain auth users if user has group manager role', () => {
      props.user.groupManager = true
      const wrapper = shallow(<AdminUtilitiesContainer {...props} />)
      const keyworkerSettingsLink = wrapper.find('Link').find({ to: '/maintain-auth-users' })

      expect(keyworkerSettingsLink.prop('children')).toEqual('Manage auth users')
    })

    it('should render a Link to create auth users if user has maintain auth user roles', () => {
      props.user.maintainAuthUsers = true
      const wrapper = shallow(<AdminUtilitiesContainer {...props} />)
      const keyworkerSettingsLink = wrapper.find('Link').find({ to: '/create-auth-user' })

      expect(keyworkerSettingsLink.prop('children')).toEqual('Create auth user')
    })
  })

  it('should render the Maintain HMPPS Users page', () => {
    props.user.maintainAccessAdmin = true
    props.user.migration = true
    props.user.maintainAuthUsers = true
    const store = { subscribe: jest.fn(), dispatch: jest.fn(), getState: jest.fn(), setState: jest.fn() }
    store.getState.mockReturnValue({ app: { error: '', loaded: true } })

    const rendered = renderer.create(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <AdminUtilitiesContainer {...props} />
        </MemoryRouter>
      </Provider>
    )

    expect(rendered.toJSON()).toMatchSnapshot()
  })
})
