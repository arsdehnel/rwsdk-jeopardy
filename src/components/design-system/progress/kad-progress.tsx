'use client';
import { Progress } from 'radix-ui';
import type * as React from 'react';
import styleClasses from './kad-progress.module.css';

export default function KADProgress({ progressPcnt }: { progressPcnt: number }): React.ReactNode {
	return (
		<Progress.Root className={styleClasses.kadProgressRoot} value={progressPcnt}>
			<Progress.Indicator
				className={styleClasses.kadProgressIndicator}
				style={{ transform: `translateX(-${100 - progressPcnt}%)` }}
			/>
		</Progress.Root>
	);
}
