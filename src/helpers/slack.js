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
  { channelName = CHANNELS.tableTennisTest },
  slackClient
) => {
  return slackClient.channels.list({ channel: channelName }).then(data => {
    const matchedChannel =
      data.channels.filter(channel => channel.name === channelName)[0] || null
    return matchedChannel.id
  })
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

export const importUsersFormChannel = async ({}, slackClient) => {
  const channelId = await getChannelId({}, slackClient)
  // const channelUsers = await (getChannelUsers({ channelId: channelId }),
  // slackClient)
  console.log('TCL: importUsersFormChannel -> channelUsers', channelId)
}
