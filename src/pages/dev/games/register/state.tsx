import type { RequestInfo } from 'rwsdk/worker';
import { RegisterLayout } from '@/layouts';
import RegisterShell from '@/views/__shells__/_register-shell';
import { caughtError } from '../../../utils';
import { REGISTERED_STATES, UNREGISTERED_STATES } from './_states';

const GAME_REGISTRATION_URL = 'https://example.com/games/mock-id/register';

export default async function Pages__dev__games__register__state({ params, ctx }: RequestInfo): Promise<React.JSX.Element> {
	try {
		const state = [...UNREGISTERED_STATES, ...REGISTERED_STATES].find(s => s.slug === params.stateSlug);

		if (!state) {
			return <p>Unknown state: {params.stateSlug}</p>;
		}

		return (
			<RegisterLayout pageTitle={`Register: ${state.label}`} currentBasePage="dev" ctx={ctx}>
				<RegisterShell {...state.props} gameRegistrationUrl={GAME_REGISTRATION_URL} />
			</RegisterLayout>
		);
	} catch (err) {
		return caughtError(err, ctx.logger);
	}
}
