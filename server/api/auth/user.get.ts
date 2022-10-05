export default defineEventHandler(async event => {
	return event.req["user"];
});