import type { DocumentProps } from 'rwsdk/router';
import type { RequestInfo } from 'rwsdk/worker';
import styles from './styles/main.css?url';

const AppDocument: React.FC<DocumentProps<RequestInfo>> = ({ children }: DocumentProps<RequestInfo>) => (
	<html lang="en">
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<title>RedwoodSDK Jeopardy</title>
			<link rel="modulepreload" href="/src/client.tsx" />
			<link rel="stylesheet" href={styles} />
		</head>
		<body>
			{children}
			<script>import("/src/client.tsx")</script>
		</body>
	</html>
);

export default AppDocument;
