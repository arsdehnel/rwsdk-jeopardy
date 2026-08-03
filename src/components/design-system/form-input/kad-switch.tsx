'use client';
import { Switch } from 'radix-ui';
import styleClasses from './kad-switch.module.css';

export function KADSwitch({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }): React.ReactNode {
	return (
		<Switch.Root
			onCheckedChange={onChange}
			value={checked as unknown as string}
			defaultChecked={checked}
			className={styleClasses.kadSwitchRoot}
		>
			<Switch.Thumb className={styleClasses.kadSwitchThumb} />
		</Switch.Root>
	);
}
