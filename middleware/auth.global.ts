import { useAuth } from '~~/store/auth';
export default defineNuxtRouteMiddleware(async (to, from) => {

	const cookie = useCookie('s_val_anayl').value;
	const auth = useAuth();

	// If the user s_val_anayl cookie is present, check auth store for user
	if (cookie && !auth.loggedIn) {
		console.log('cookie', cookie);
		await auth.fetchUser()
			.catch((err) => {
				console.log(err);
			});
	}
})