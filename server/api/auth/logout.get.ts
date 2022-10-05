import { Session } from "~~/server/db/Session";

export default defineEventHandler(async event => {
	
	const user = event.req["user"];
	
	// Delete Session
	await Session.deleteOne({ sessionId: user.sessionId });

	// Delete Cookie
	deleteCookie(event, 's_val_anayl');
});