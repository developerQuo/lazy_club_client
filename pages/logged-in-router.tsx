import React from 'react';
import { isLoggedInVar } from '../apollo';
import useMe from '../utils/hooks/useMe';

const LoggedInRouter = () => {
	const { data, loading, error } = useMe();

	if (!data || loading || error) {
		return (
			<div className="h-screen flex justify-center items-center">
				<span className="font-medium text-xl tracking-wide">Loading...</span>
			</div>
		);
	}
	return (
		<div>
			<h1>{data.me.role}</h1>
			<button onClick={() => isLoggedInVar(false)}>Log Out</button>
		</div>
	);
};

export default LoggedInRouter;
