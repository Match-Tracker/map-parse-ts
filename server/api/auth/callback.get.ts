import { fetchGuilds } from './../../util/discord';
import { Session } from '~~/server/db/Session';
import { User } from '~~/server/db/User';
import crypto from 'crypto';
import axios from 'axios';
import QueryString from 'qs';


export default defineEventHandler(async event => {
  try {
    const code = getQuery(event).code

    if (!code) {
      sendError(event, createError({ statusCode: 400, statusMessage: 'Bad Request', data: 'No code provided in query parameters.' }));
      return
    }
    // Handle OAuth Callback from Discord using Axios
    const config = useRuntimeConfig();
    console.log(config.public.REDIRECT_URI)
    const { data } = await axios.post('https://discord.com/api/oauth2/token', QueryString.stringify({
      client_id: config.CLIENT_ID,
      client_secret: config.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code.toString(),
      redirect_uri: config.public.REDIRECT_URI,
      scope: 'identify email guilds guilds.members.read'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (!data.access_token) {
      sendError(event, createError({ statusCode: 400, statusMessage: 'Bad Request', data: 'No Access token provided from Discord, please try again.' }));
      return
    }

    const { data: userData } = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        authorization: `Bearer ${data.access_token}`
      }
    })

    if (!userData.id) {
      sendError(event, createError({ statusCode: 400, statusMessage: 'Bad Request', data: 'No User ID provided from Discord, please try again.' }));
      return
    }
    
    // Fetch Discord Data of User
    const guilds = await fetchGuilds(data.access_token);

    // Create User in Database
    let user = await User.findOne({ discordId: userData.id });

    if (!user) {
      user = await User.create({
        discordId: userData.id,
        username: userData.username,
        avatar: userData.avatar,
        email: userData.email,
        guilds
      })

      await user.save();
    }

    // Check for previous session
    const previousSession = await Session.findOne({ user: user._id });
    
    if (previousSession) {
      await previousSession.deleteOne();
    }

    // Create a session for the User
    const session = await Session.create({
      user: user._id,
      accessToken: data.access_token,
      createdAt: Date.now() + data.expires_in,
      isOnline: true
    })
    
    // Encrypt config.SESSION_SECRET with session._id using sha1
    const SessionID = crypto.createHash('sha1').update(`${config.SESSION_SECRET}-${session._id}`).digest('hex');

    // Update Session to have SessionID
    session.sessionId = SessionID;
    await session.save();
    
    // Set Session ID as a Cookie for the User
    setCookie(event, 's_val_anayl', session.sessionId.toString(), {
      httpOnly: true,
      maxAge: data.expires_in,
      path: '/'
    })

    // Redirect User to Dashboard
    await sendRedirect(event, '/')
  } catch (error) {
    console.log(error)
    sendError(event, createError({ statusCode: 500, statusMessage: 'Internal Server Error', data: 'An error occurred while processing your request.' }));
  }
})