import analytics from '@react-native-firebase/analytics'

const events = [
  "log_in",
  "log_out", // from: user|server
]

export default {
  logEvent: async (event, params) => {
    if (!events.includes(event))
      return console.error(event, 'is not a valid event')

    await analytics().logEvent(event, params)
  },
  initUser: async (userId, userProps) => {
    await analytics().setUserId(userId)
    // await analytics().setUserProperties(userProps)
  }
}