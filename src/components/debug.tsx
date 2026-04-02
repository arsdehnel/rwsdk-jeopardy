export default function Debug({ object }: { object: any }) {
	return (
		<div style={{ backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '1rem', marginTop: '1rem' }}>
			<h3>Debug Info</h3>
			<pre>{JSON.stringify(object, null, 2)}</pre>
		</div>
	);
}
