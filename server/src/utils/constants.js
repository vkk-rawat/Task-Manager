export const USER_ROLES = ['admin', 'member'];

export const PROJECT_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export const TASK_STATUS_OPTIONS = ['To Do', 'In Progress', 'Done'];

export const TASK_LEGACY_STATUS_ALIASES = {
	Todo: 'To Do',
	Review: 'In Progress',
	Completed: 'Done'
};

export const TASK_STATUSES = [...TASK_STATUS_OPTIONS, 'Overdue', ...Object.keys(TASK_LEGACY_STATUS_ALIASES)];

export const normalizeTaskStatus = (status) => TASK_LEGACY_STATUS_ALIASES[status] || status;

export const getTaskStatusFilterValues = (status) => {
	const normalized = normalizeTaskStatus(status);

	if (normalized === 'To Do') {
		return ['To Do', 'Todo'];
	}

	if (normalized === 'In Progress') {
		return ['In Progress', 'Review'];
	}

	if (normalized === 'Done') {
		return ['Done', 'Completed'];
	}

	return [normalized];
};
