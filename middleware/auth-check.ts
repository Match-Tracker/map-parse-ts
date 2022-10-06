import { useAuth } from "~~/store/auth";


export default defineNuxtRouteMiddleware(async (to, from) => {
	const auth = useAuth();
	
	// If the user is not authed and the page requires it, redirect to auth page
	if (!auth.loggedIn || !auth.user) {
		return navigateTo('/api/auth');
	}
});