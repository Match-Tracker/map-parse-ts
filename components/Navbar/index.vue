<template>
	<div class="navbar px-12 py-8">
		<div class="flex-1">
		</div>
		<div class="flex-none gap-2">
			<div v-if="auth.loggedIn" class="dropdown dropdown-end">
				<label tabindex="0" class="btn btn-ghost btn-circle w-14 h-14 avatar">
					<div class="w-full rounded-full">
						<img :src="`https://cdn.discordapp.com/avatars/${auth.user.discordId}/${auth.user.avatar}.webp?size=128`" />
					</div>
				</label>

				<client-only>
					<ul tabindex="0" class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-neutral rounded-box">
						<NuxtLink v-for="route in menuRoutes" :to="route.path">
							<li class="my-1">
								<a>
									<f-icon :icon="['far', route.icon]" />
									{{ route.name }}
								</a>
							</li>
						</NuxtLink>
						<li class="my-1">
							<a class="bg-red-500 text-white" @click="auth.logout">
								<f-icon :icon="['far', 'right-from-bracket']" />
								Logout
							</a>
						</li>
					</ul>
				</client-only>
			</div>
			
			<client-only v-else>
				<a class="btn btn-primary normal-case btn-md" href="/api/auth">
					<f-icon :icon="['fab', 'discord']" class="mr-2" />
					Sign In
				</a>
			</client-only>
		</div>
	</div>
</template>

<script setup>
import { useAuth } from '~~/store/auth';

const auth = useAuth()

const menuRoutes = [
	{
		name: 'Account',
		icon: 'fa-gear',
		path: '/'
	}
]
</script>