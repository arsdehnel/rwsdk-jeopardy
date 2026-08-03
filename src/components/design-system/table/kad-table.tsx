'use client';
import type { KADTableColumn, Permission } from '@/types';
import KADLink from '../link/kad-link';
import styleClasses from './kad-table.module.css';

export default function KADTable<T extends Record<string, unknown>>({
	columns,
	data,
	rowIndex = 'id',
	userPermissions,
}: {
	columns: KADTableColumn[];
	data: T[];
	rowIndex?: keyof T;
	userPermissions: Permission[];
}): React.ReactNode {
	return (
		<table className={styleClasses.kadTable}>
			<thead>
				<tr>
					{columns.map(c => {
						return <th key={c.key}>{c.label}</th>;
					})}
				</tr>
			</thead>
			<tbody>
				{data.map(d => {
					return (
						<tr key={d[rowIndex] as string}>
							{columns.map(c => {
								if (c.actions) {
									return (
										<td key={c.key} className={styleClasses.kadTableActions}>
											{c.actions.map(a => {
												if (a.type === 'link') {
													const { hrefProp, ...other } = a;
													const href = String(d[hrefProp ?? 'link']);
													return <KADLink key={href} href={href} {...other} userPermissions={userPermissions} />;
												} else {
													return (
														<button key={String(a.handler)} type="button" onClick={(): void => a.handler?.(String(d[c.key]), d)}>
															{a.label}
														</button>
													);
												}
											})}
										</td>
									);
								}
								return <td key={c.key}>{c.render ? c.render(String(d[c.key]), d) : String(d[c.key])}</td>;
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
}
