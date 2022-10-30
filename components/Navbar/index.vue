<template>
	<div class="navbar px-32 py-8">
		<div class="flex-1">
			<NuxtLink to="/">
				<img src="~/assets/img/logo.svg" class="w-48" />
			</NuxtLink>

			<div class="links flex gap-12 ml-48">
				<NuxtLink v-for="(route, index) in routes" :key="index" :to="route.path">
					{{ route.name }}
				</NuxtLink>
			</div>
		</div>
		<div class="flex-none">
			<div class="flex justify-center items-center gap-12" v-if="auth.loggedIn">
				<NuxtLink class="font-medium hover:text-white active:scale-95 transition-all" to="/account/matches">
					My Matches
					<div class="border-b-2 pt-1 w-5/6 border-primary mx-auto" />
				</NuxtLink>

				<div class="dropdown dropdown-end">
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

const routes = [
	{
		name: 'About',
		icon: 'home',
		path: '/'
	},
	{
		name: 'Games',
		icon: 'gamepad',
		path: '/games'
	},
	{
		name: 'Pricing',
		icon: 'dollar-sign',
		path: '/upgrade'
	}
]
</script>