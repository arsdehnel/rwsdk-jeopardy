'use client';
import { RadioGroup } from 'radix-ui';
import styleClasses from './kad-radio-group.module.css';

export function KADRadioGroup({
	label,
	options,
	value,
	onChange,
}: {
	label: string;
	options: Array<{ value: string; label: string }>;
	value: string;
	onChange: (value: string) => void;
}): React.ReactNode {
	return (
		<RadioGroup.Root
			className={styleClasses.kadRadioGroupRoot}
			defaultValue={value}
			value={value}
			aria-label={label}
			onValueChange={onChange}
		>
			{options.map(option => (
				<div style={{ display: 'flex', alignItems: 'center' }} key={option.value}>
					<RadioGroup.Item className={styleClasses.kadRadioGroupItem} value={option.value} id={`r${option.value}`}>
						<RadioGroup.Indicator className={styleClasses.kadRadioGroupIndicator} />
					</RadioGroup.Item>
					<label className={styleClasses.kadRadioGroupLabel} htmlFor={`r${option.value}`}>
						{option.label}
					</label>
				</div>
			))}
		</RadioGroup.Root>
	);
}
