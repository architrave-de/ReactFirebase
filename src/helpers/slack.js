import Slack from 'slack'
import apiCall from '../helpers/API'

const CHANNELS = {
  tableTennis: '',
  tableTennisTest: 'test-bot-firebase'
}

/**
 * avoid using token locally and get it form the DB upon each action
 * @param {function}  action - to fire after getting the token
 * @param {object} args - pass to action function
 */
export const slackAction = async (action, args) => {
  return apiCall
    .getToken()
    .then(token => {
      return new Slack({
        token: token,
        scopes: 'bot'
      })
    })
    .then(slack => action({ ...args }, slack))
    .catch(err => console.error(err))
}

/**
 * @param {userId} string || number - slack user id
 * @param {text} string - message text
 * @returns {undefined}
 */
export const openConversation = async (
  { userId = 'UDF2V2LBE', text },
  slackClient
) => {
  return slackClient.conversations
    .open({ users: userId })
    .then(data => {
      sendMessageToChannel({ channel: data.channel.id, text: 'new DM' })
    })
    .then(res => res)
    .catch(error => console.error())
}

/**
 * @param {channel} string - channel name
 * @param {text} string - message text
 * @returns {string} - channel ID
 */
export const sendMessageToChannel = (
  { channel = CHANNELS.tableTennisTest, text },
  slackClient
) => slackClient.chat.postMessage({ channel, text })

/**
 * @param {channel} string - channel name
 * @returns {string} - channel ID
 */
export const getChannelId = async (
  { channelName = CHANNELS.tableTennisTest },
  slackClient
) => {
  return slackClient.channels
    .list({ channel: channelName })
    .then(data => {
      const matchedChannel =
        data.channels.filter(channel => channel.name === channelName)[0] || null
      return matchedChannel.id
    })
    .catch(err => console.error(err))
}

/**
 *
 * @param {channelId} string|| number - channel id
 * @returns {array} - channel members
 */
export const getChannelUsers = ({ channelId }, slackClient) => {
  return slackClient.conversations.members({ channel: channelId })
}

/**
 * @returns {array} - all workspace members, including the inactive ones
 */
export const getWorkspaceUsers = async slackClient => {
  return slackClient.users.list().then(data => {
    return data.members
  })
}

/**
 *
 * @param {userId} string|| number - channel id
 * @returns {object} - user infos
 */
const getUserData = ({ user }, slackClient) => {
  return slackClient.users.info({ user }).then(data => {
    return data.user
  })
}

/**
 *
 * @param {channelName} string - slack channel name without (hash)
 * @returns {array} - array of objects each represent a user infos
 */
export const importUsersFormChannel = async ({ channelName }, slackClient) => {
  return getChannelId({}, slackClient)
    .then(id => getChannelUsers({ channelId: id }, slackClient))
    .then(users => {
      let usersInfos = []
      users.members.forEach(user =>
        getUserData({ user }, slackClient).then(user => {
          const { real_name, email, image_192 } = user.profile
          usersInfos.push({
            name: real_name,
            email,
            image: image_192,
            slackName: user.name
          })
        })
      )
      return usersInfos
    })
    .catch(err => console.error(err))
}
