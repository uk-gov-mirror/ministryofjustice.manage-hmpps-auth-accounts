import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { shallow, mount } from 'enzyme'

import AuthUserSearchResultsContainer from './AuthUserSearchResultsContainer'

describe('Auth search results container', () => {
  it('should render correctly without existing location', () => {
    const wrapper = shallow(<AuthUserSearchResultsContainer location={{ search: {} }} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correctly with search location', () => {
    const wrapper = shallow(<AuthUserSearchResultsContainer location={{ search: { user: 'auser' } }} />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('handle change and search', () => {
    const event = { target: { name: 'user', value: 'usersearched' }, preventDefault: jest.fn() }
    const store = { subscribe: jest.fn(), dispatch: jest.fn(), getState: jest.fn(), setState: jest.fn() }
    store.getState.mockReturnValue({
      app: { error: '', loaded: true },
      maintainAuthUsers: { userList: [] },
    })

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AuthUserSearchResultsContainer />
        </MemoryRouter>
      </Provider>
    )
    wrapper.find('input#user').simulate('change', event)

    it('should set the user input on the state', () => {
      expect(wrapper.find('AuthUserSearchHoc').state().user).toEqual('usersearched')
    })

    it('should set history when form submitted', () => {
      wrapper.find('form').simulate('submit')

      const {
        location: { pathname, search },
      } = wrapper.find('AuthUserSearchResultsContainer').props()

      expect(pathname).toEqual('/maintain-auth-users/search-results')
      expect(search).toEqual('?user=usersearched')
    })

    it('should prevent default on the form submission', () => {
      const submitEvent = { target: { value: 'search' }, preventDefault: jest.fn() }
      wrapper.find('form').simulate('submit', submitEvent)

      expect(submitEvent.preventDefault).toBeCalled()
    })
  })

  describe('handle edit', () => {
    // value of the event is 1, which is the second recond in the user list
    const event = { target: { name: 'user', value: 1 }, preventDefault: jest.fn() }
    const store = { subscribe: jest.fn(), dispatch: jest.fn(), getState: jest.fn(), setState: jest.fn() }
    store.getState.mockReturnValue({
      app: { error: '', loaded: true },
      maintainAuthUsers: {
        userList: [
          {
            firstName: 'Bob',
            lastName: 'Builder',
            username: 'bobthebuilder',
            email: 'a@b.com',
            locked: false,
            enabled: true,
          },
          {
            firstName: 'Farmer',
            lastName: 'Pickles',
            username: 'farmerpickles',
            email: 'a@c.com',
            locked: false,
            enabled: true,
          },
        ],
      },
    })

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter>
          <AuthUserSearchResultsContainer />
        </MemoryRouter>
      </Provider>
    )
    wrapper.find('button#edit-button-bobthebuilder').simulate('click', event)

    it('should set history when form submitted', () => {
      const {
        location: { pathname },
      } = wrapper.find('AuthUserSearchResultsContainer').props()

      expect(pathname).toEqual('/maintain-auth-users/farmerpickles')
    })

    it('should prevent default on the form submission', () => {
      expect(event.preventDefault).toBeCalled()
    })
  })
})