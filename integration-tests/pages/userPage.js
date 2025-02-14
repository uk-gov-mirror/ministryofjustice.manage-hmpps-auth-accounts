const page = require('./page')

const userPage = (user) =>
  page(user, {
    userRows: () => cy.get('[data-qa="user-details"] tbody tr'),
    roleRows: () => cy.get('[data-qa="user-roles"] tbody tr'),
    groupRows: () => cy.get('[data-qa="user-groups"] tbody tr'),
    addRole: () => cy.get('[data-qa="add-role-button"]'),
    addGroup: () => cy.get('[data-qa="add-group-button"]'),
    removeRole: (role) => cy.get(`[data-qa="remove-button-${role}"]`),
    removeGroup: (group) => cy.get(`[data-qa="remove-button-${group}"]`),
    searchResultsBreadcrumb: () => cy.get('a[href*="results"]'),
    enableLink: () => cy.get('[data-qa="enable-button"]'),
    changeEmailLink: () => cy.get('[data-qa="amend-link"]'),
    searchLink: () => cy.get('[data-qa="search-link"]'),
    enabled: () => cy.get('[data-qa="enabled"]'),
    errorSummary: () => cy.get('[data-qa-errors]'),
  })

export default {
  verifyOnPage: userPage,
}
