import React from 'react'
import { shallow } from 'enzyme'
import { AddRole } from './AddRole'
import mockHistory from '../../../test/mockHistory'

describe('User search component', () => {
  it('should render the initial view of the add role page with a filtered list of roles', async () => {
    const component = shallow(
      <AddRole
        roleList={[{ roleCode: 'ROLE_1', roleName: 'Role 1', roleFunction: '', roleId: 1 }]}
        roleFilterList={[
          { roleCode: 'ROLE_1', roleName: 'Role 1', roleFunction: '', roleId: 1 },
          { roleCode: 'ROLE_2', roleName: 'Role 2', roleFunction: '', roleId: 2 },
        ]}
        handleCancel={jest.fn()}
        handleAdd={jest.fn()}
        history={mockHistory}
        roleFilter=""
        validationErrors={{}}
        handleRoleAddChange={jest.fn()}
      />
    )
    expect(component.find('#add-button').text()).toEqual('Confirm')
    expect(component.find('#cancel-button').length).toEqual(1)
    expect(component.find('#role-select').find('option').length).toEqual(2) // there is also a '-- select--' option
  })

  it('should handle updates', async () => {
    const handleCancelMock = jest.fn()
    const handleAddMock = jest.fn()
    const component = shallow(
      <AddRole
        roleList={[
          { roleCode: 'ROLE_1', roleName: 'Role 1', roleFunction: '', roleId: 1 },
          { roleCode: 'ROLE_2', roleName: 'Role 2', roleFunction: '', roleId: 2 },
        ]}
        roleFilterList={[
          { roleCode: 'ROLE_1', roleName: 'Role 1', roleFunction: '', roleId: 1 },
          { roleCode: 'ROLE_2', roleName: 'Role 2', roleFunction: '', roleId: 2 },
          { roleCode: 'ROLE_3', roleName: 'Role 3', roleFunction: '', roleId: 3 },
        ]}
        handleCancel={handleCancelMock}
        handleAdd={handleAddMock}
        history={mockHistory}
        roleFilter=""
        validationErrors={{}}
        handleRoleAddChange={jest.fn()}
      />
    )
    component.find('#add-button').simulate('click')
    expect(handleAddMock).toHaveBeenCalled()
    component.find('#cancel-button').simulate('click')
    expect(handleCancelMock).toHaveBeenCalled()
  })

  it('should display message if no roles to allocate', async () => {
    const component = shallow(
      <AddRole
        roleList={[
          { roleCode: 'ROLE_1', roleName: 'Role 1', roleFunction: '', roleId: 1 },
          { roleCode: 'ROLE_2', roleName: 'Role 2', roleFunction: '', roleId: 2 },
        ]}
        roleFilterList={[
          { roleCode: 'ROLE_1', roleName: 'Role 1', roleFunction: '', roleId: 1 },
          { roleCode: 'ROLE_2', roleName: 'Role 2', roleFunction: '', roleId: 2 },
        ]}
        handleCancel={jest.fn()}
        handleAdd={jest.fn()}
        history={mockHistory}
        roleFilter=""
        validationErrors={{}}
        handleRoleAddChange={jest.fn()}
      />
    )
    expect(component.find('#add-button').length).toEqual(0)
    expect(component.text()).toContain('No roles available')
  })
})
