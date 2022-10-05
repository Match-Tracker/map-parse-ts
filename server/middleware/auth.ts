import { sendError, H3Error } from 'h3';

import { User } from '../db/User';
import { Session } from '../db/Session';

export default defineEventHandler(async (event) => {
  // If on /auth route, go next'
  if (event.req.url.includes('callback') || event.req.url === '/auth') {
    return;
  }

  // Fetch Session ID from Cookie
  const cookie = getCookie(event, 's_val_anayl');
  if (!cookie) {
    // return sendError(event, createError({ statusCode: 401, message: 'Unauthorized' }));
    return;
  }
  
  // Fetch Session from Database
  const session = await Session.findOne({ sessionId: cookie });

  if (!session) {
    deleteCookie(event, 's_val_anayl');

    // Redirect to Auth
    return sendRedirect(event, '/api/auth');
  }

  // Fetch User from Database
  const user = await User.findOne({ _id: session.user });

  if (!user) {
    deleteCookie(event, 's_val_anayl');
    return sendError(event, createError({ statusCode: 401, message: 'Unauthorized' }));
  }
  
  event.req["user"] = user;
})