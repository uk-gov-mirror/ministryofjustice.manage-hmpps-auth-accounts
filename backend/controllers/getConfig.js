const config = require('../config')

const getConfiguration = async (req, res) =>
  res.json({
    notmEndpointUrl: config.app.notmEndpointUrl,
    mailTo: config.app.mailTo,
    googleAnalyticsId: config.analytics.googleAnalyticsId,
  })

module.exports = {
  getConfiguration,
}