'use client';
import { closestCenter, DndContext, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import styleClasses from './kad-sortable-list.module.css';

function SortableItem({ id, children }: { id: string; children: React.ReactNode }): React.ReactNode {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`${styleClasses.kadSortableItem}${isDragging ? ` ${styleClasses.kadSortableItemDragging}` : ''}`}
		>
			<button
				type="button"
				className={styleClasses.kadSortableHandle}
				aria-label="Drag to reorder"
				{...listeners}
				{...attributes}
			>
				<DragHandleDots2Icon />
			</button>
			<div className={styleClasses.kadSortableContent}>{children}</div>
		</div>
	);
}

export function KADSortableList<T extends { id: string }>({
	items,
	renderItem,
	onChange,
}: {
	items: T[];
	renderItem: (item: T) => React.ReactNode;
	onChange: (items: T[]) => void;
}): React.ReactNode {
	function handleDragEnd(event: DragEndEvent): void {
		const { active, over } = event;
		if (over && active.id !== over.id) {
			const oldIndex = items.findIndex(i => i.id === active.id);
			const newIndex = items.findIndex(i => i.id === over.id);
			onChange(arrayMove(items, oldIndex, newIndex));
		}
	}

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
				<div className={styleClasses.kadSortableList}>
					{items.map(item => (
						<SortableItem key={item.id} id={item.id}>
							{renderItem(item)}
						</SortableItem>
					))}
				</div>
			</SortableContext>
		</DndContext>
	);
}
