import Slack from 'slack'
import apiCall from '../helpers/API'

const CHANNELS = {
  tableTennis: '',
  mainSport: 'archsports',
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
      sendMessageToChannel({ channelName: data.channel.id, text: 'new DM' })
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
  { channelName = CHANNELS.tableTennisTest, text, blocks = [] },
  slackClient
) => slackClient.chat.postMessage({ channel: channelName, text, blocks })

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
 * @returns {array} - all workspace members, including the inactive ones
 */
export const getWorkspaceChannels = ({}, slackClient) => {
  return slackClient.channels.list().then(data => data.channels)
}

/**
 * @param {userId} string|| number - channel id
 * @returns {object} - user infos
 */
const getUserData = ({ user }, slackClient) => {
  return slackClient.users.info({ user })
}

/**
 * @param {channelName} string - slack channel name without (hash)
 * @returns {array} - array of objects each represent a user infos
 */
export const importUsersFormChannel = async ({ channelName }, slackClient) => {
  const channelId = await getChannelId({ channelName }, slackClient)
  const channelUsers = await getChannelUsers(
    { channelId: channelId },
    slackClient
  )
  let users = []
  channelUsers.members.forEach(async user => {
    const userData = await getUserData({ user }, slackClient)
    const { real_name, email, image_192 } = userData.user.profile
    users.push({
      slackName: userData.user.name,
      name: real_name,
      email,
      image: image_192
    })
  })

  return users
}

export const formattedSlackMessage = ({ round }) => {
  const { players } = round
  return [
    {
      type: 'divider'
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${round.description}*\n`
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `* 1: ${players['1'].name}* :first_place_medal:\n got the first place with 3 points`
      },
      accessory: {
        type: 'image',
        image_url: `${players['1'].image}`,
        alt_text: `${players['1'].name}`
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `* 2: ${players['2'].name}* :second_place_medal:\n got the second place with 2 points`
      },
      accessory: {
        type: 'image',
        image_url: `${players['2'].image}`,
        alt_text: `${players['2'].name}`
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `* 3: ${players['3'].name}* :third_place_medal:\n got the third place with 1 points`
      },
      accessory: {
        type: 'image',
        image_url: `${players['3'].image}`,
        alt_text: `${players['3'].name}`
      }
    }
  ]
}
