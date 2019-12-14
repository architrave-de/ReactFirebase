import Slack from 'slack'
import apiCall from '../helpers/API'

const CHANNELS = {
  tableTennis: '',
  tableTennisTest: 'test-bot-firebase'
}

const SlackBot = new Slack({
  token: 'xoxb-ADD YOUR TOKEN HERE',
  scopes: 'bot'
})

/**
 * @param {userId} string || number - slack user id
 * @param {text} string - message text
 * @returns {undefined}
 */
export const openConversation = async ({ userId = 'UDF2V2LBE', text }) => {
  return SlackBot.conversations
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
export const sendMessageToChannel = ({
  channel = CHANNELS.tableTennisTest,
  text
}) => SlackBot.chat.postMessage({ channel, text })

/**
 * @param {channel} string - channel name
 * @returns {string} - channel ID
 */
export const getChannelId = async ({ channel = CHANNELS.tableTennisTest }) => {
  const channels = await SlackBot.channels.list({ channel }).then(data => {
    return data.channels
  })
  const channelId =
    (await channels.filter(channel => channel.name === channel)[0].id) || null
  return channelId
}

/**
 *
 * @param {channelId} string|| number - channel id
 * @returns {array} - channel members
 */
export const getChannelUsers = ({ channelId }) => {
  return SlackBot.conversations.members({ channel: channelId })
}

/**
 * @returns {array} - all workspace members, including the inactive ones
 */
export const getWorkspaceUsers = async () => {
  return SlackBot.users.list().then(data => {
    return data.members
  })
}
