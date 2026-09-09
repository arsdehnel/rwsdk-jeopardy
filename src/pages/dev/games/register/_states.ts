import type { ContestantRegistration, DisplayRegistration, Permission, Role } from '@/types';

export type RegisterDevState = {
	slug: string;
	label: string;
	props: {
		currentUserRole?: Role;
		hasHost: boolean;
		hasDisplay: boolean;
		display?: DisplayRegistration;
		contestants: ContestantRegistration[];
		userPermissions: Permission[];
	};
};

const CONTESTANTS = {
	none: [] as ContestantRegistration[],
	one: [{ sessionId: 'c1', name: 'Alice' }] as ContestantRegistration[],
	many: [
		{ sessionId: 'c1', name: 'Alice' },
		{ sessionId: 'c2', name: 'Bob' },
	] as ContestantRegistration[],
};

const PERMISSIONS = {
	host: ['games:host'] as Permission[],
	none: [] as Permission[],
};

const DISPLAY: DisplayRegistration = { sessionId: 'display-session' };

// biome-ignore format: compact table layout — each row is one state
export const UNREGISTERED_STATES: RegisterDevState[] = [
	// ── no slots taken ──────────────────────────────────────────────────────────
	{ slug: 'no-slots-host-perm-no-contestants',      label: 'no slots taken | host perm | no contestants', props: { hasHost: false, hasDisplay: false, userPermissions: PERMISSIONS.host, contestants: CONTESTANTS.none } },
	{ slug: 'no-slots-host-perm-1-contestant',        label: 'no slots taken | host perm | 1 contestant',   props: { hasHost: false, hasDisplay: false, userPermissions: PERMISSIONS.host, contestants: CONTESTANTS.one  } },
	{ slug: 'no-slots-host-perm-2-contestants',       label: 'no slots taken | host perm | 2 contestants',  props: { hasHost: false, hasDisplay: false, userPermissions: PERMISSIONS.host, contestants: CONTESTANTS.many } },
	{ slug: 'no-slots-no-perm-no-contestants',        label: 'no slots taken | no perm  | no contestants',  props: { hasHost: false, hasDisplay: false, userPermissions: PERMISSIONS.none, contestants: CONTESTANTS.none } },
	{ slug: 'no-slots-no-perm-1-contestant',          label: 'no slots taken | no perm  | 1 contestant',    props: { hasHost: false, hasDisplay: false, userPermissions: PERMISSIONS.none, contestants: CONTESTANTS.one  } },
	{ slug: 'no-slots-no-perm-2-contestants',         label: 'no slots taken | no perm  | 2 contestants',   props: { hasHost: false, hasDisplay: false, userPermissions: PERMISSIONS.none, contestants: CONTESTANTS.many } },
	// ── host slot taken ─────────────────────────────────────────────────────────
	{ slug: 'host-taken-host-perm-no-contestants',    label: 'host taken | host perm | no contestants',     props: { hasHost: true,  hasDisplay: false, userPermissions: PERMISSIONS.host, contestants: CONTESTANTS.none } },
	{ slug: 'host-taken-host-perm-1-contestant',      label: 'host taken | host perm | 1 contestant',       props: { hasHost: true,  hasDisplay: false, userPermissions: PERMISSIONS.host, contestants: CONTESTANTS.one  } },
	{ slug: 'host-taken-host-perm-2-contestants',     label: 'host taken | host perm | 2 contestants',      props: { hasHost: true,  hasDisplay: false, userPermissions: PERMISSIONS.host, contestants: CONTESTANTS.many } },
	{ slug: 'host-taken-no-perm-no-contestants',      label: 'host taken | no perm  | no contestants',      props: { hasHost: true,  hasDisplay: false, userPermissions: PERMISSIONS.none, contestants: CONTESTANTS.none } },
	{ slug: 'host-taken-no-perm-1-contestant',        label: 'host taken | no perm  | 1 contestant',        props: { hasHost: true,  hasDisplay: false, userPermissions: PERMISSIONS.none, contestants: CONTESTANTS.one  } },
	{ slug: 'host-taken-no-perm-2-contestants',       label: 'host taken | no perm  | 2 contestants',       props: { hasHost: true,  hasDisplay: false, userPermissions: PERMISSIONS.none, contestants: CONTESTANTS.many } },
	// ── display slot taken ──────────────────────────────────────────────────────
	{ slug: 'display-taken-host-perm-no-contestants', label: 'display taken | host perm | no contestants',  props: { hasHost: false, hasDisplay: true,  userPermissions: PERMISSIONS.host, contestants: CONTESTANTS.none } },
	{ slug: 'display-taken-host-perm-1-contestant',   label: 'display taken | host perm | 1 contestant',    props: { hasHost: false, hasDisplay: true,  userPermissions: PERMISSIONS.host, contestants: CONTESTANTS.one  } },
	{ slug: 'display-taken-host-perm-2-contestants',  label: 'display taken | host perm | 2 contestants',   props: { hasHost: false, hasDisplay: true,  userPermissions: PERMISSIONS.host, contestants: CONTESTANTS.many } },
	{ slug: 'display-taken-no-perm-no-contestants',   label: 'display taken | no perm  | no contestants',   props: { hasHost: false, hasDisplay: true,  userPermissions: PERMISSIONS.none, contestants: CONTESTANTS.none } },
	{ slug: 'display-taken-no-perm-1-contestant',     label: 'display taken | no perm  | 1 contestant',     props: { hasHost: false, hasDisplay: true,  userPermissions: PERMISSIONS.none, contestants: CONTESTANTS.one  } },
	{ slug: 'display-taken-no-perm-2-contestants',    label: 'display taken | no perm  | 2 contestants',    props: { hasHost: false, hasDisplay: true,  userPermissions: PERMISSIONS.none, contestants: CONTESTANTS.many } },
	// ── both slots taken ────────────────────────────────────────────────────────
	{ slug: 'both-taken-host-perm-no-contestants',    label: 'both taken | host perm | no contestants',     props: { hasHost: true,  hasDisplay: true,  userPermissions: PERMISSIONS.host, contestants: CONTESTANTS.none } },
	{ slug: 'both-taken-host-perm-1-contestant',      label: 'both taken | host perm | 1 contestant',       props: { hasHost: true,  hasDisplay: true,  userPermissions: PERMISSIONS.host, contestants: CONTESTANTS.one  } },
	{ slug: 'both-taken-host-perm-2-contestants',     label: 'both taken | host perm | 2 contestants',      props: { hasHost: true,  hasDisplay: true,  userPermissions: PERMISSIONS.host, contestants: CONTESTANTS.many } },
	{ slug: 'both-taken-no-perm-no-contestants',      label: 'both taken | no perm  | no contestants',      props: { hasHost: true,  hasDisplay: true,  userPermissions: PERMISSIONS.none, contestants: CONTESTANTS.none } },
	{ slug: 'both-taken-no-perm-1-contestant',        label: 'both taken | no perm  | 1 contestant',        props: { hasHost: true,  hasDisplay: true,  userPermissions: PERMISSIONS.none, contestants: CONTESTANTS.one  } },
	{ slug: 'both-taken-no-perm-2-contestants',       label: 'both taken | no perm  | 2 contestants',       props: { hasHost: true,  hasDisplay: true,  userPermissions: PERMISSIONS.none, contestants: CONTESTANTS.many } },
];

export const REGISTERED_STATES: RegisterDevState[] = [
	{
		slug: 'registered-as-display',
		label: 'registered as display',
		props: {
			currentUserRole: 'display',
			hasHost: false,
			hasDisplay: true,
			contestants: CONTESTANTS.none,
			userPermissions: PERMISSIONS.host,
		},
	},
	{
		slug: 'registered-as-contestant',
		label: 'registered as contestant',
		props: {
			currentUserRole: 'contestant',
			hasHost: false,
			hasDisplay: false,
			contestants: CONTESTANTS.none,
			userPermissions: PERMISSIONS.host,
		},
	},
	{
		slug: 'registered-as-host-no-display',
		label: 'registered as host | no display registered',
		props: {
			currentUserRole: 'host',
			hasHost: true,
			hasDisplay: false,
			display: undefined,
			contestants: CONTESTANTS.none,
			userPermissions: PERMISSIONS.host,
		},
	},
	{
		slug: 'registered-as-host-1-contestant',
		label: 'registered as host | display registered | fewer than 2 contestants',
		props: {
			currentUserRole: 'host',
			hasHost: true,
			hasDisplay: true,
			display: DISPLAY,
			contestants: CONTESTANTS.one,
			userPermissions: PERMISSIONS.host,
		},
	},
	{
		slug: 'registered-as-host-2-contestants',
		label: 'registered as host | display registered | 2+ contestants',
		props: {
			currentUserRole: 'host',
			hasHost: true,
			hasDisplay: true,
			display: DISPLAY,
			contestants: CONTESTANTS.many,
			userPermissions: PERMISSIONS.host,
		},
	},
];
