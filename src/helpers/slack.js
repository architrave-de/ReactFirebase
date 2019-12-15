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
  apiCall
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
  { channel = CHANNELS.tableTennisTest },
  slackClient
) => {
  const channels = await slackClient.channels
    .list({ channel })
    .then(data => data.channels)
  const channelId =
    (await channels.filter(channel => channel.name === channel[0].id)) || null
  return channelId
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
