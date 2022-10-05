export default defineEventHandler(async event => {
  // Redirect to Discord OAuth URL
  const config = useRuntimeConfig();
  const URL = config.public.OAUTH_URL

  await sendRedirect(event, URL)
})