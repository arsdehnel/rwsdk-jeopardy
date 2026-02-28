const categories = [
	{
		id: 1,
		title: 'Animal Kingdom',
		clues: [
			{
				question: 'This is the only mammal capable of true flight.',
				answer: 'What is a bat?',
				id: 1,
			},
			{
				question: 'This animal can sleep standing up and only needs about 3 hours of sleep per day.',
				answer: 'What is a horse?',
				id: 2,
			},
			{
				question: 'This bird is the fastest animal on Earth, reaching speeds over 240 mph when diving.',
				answer: 'What is a peregrine falcon?',
				id: 3,
			},
			{
				question: 'This marine animal has three hearts and blue blood.',
				answer: 'What is an octopus?',
				id: 4,
			},
			{
				question: 'This is the largest living land animal, weighing up to 14,000 pounds.',
				answer: 'What is an elephant?',
				id: 5,
			},
		],
	},
	{
		id: 2,
		title: 'Life Skills 101',
		clues: [
			{
				question: 'This is what you should do with 10-20% of any money you earn before spending on wants.',
				answer: 'What is save it?',
				id: 1,
			},
			{
				question: 'When you start driving, this is the one thing you should never do while behind the wheel, even at red lights.',
				answer: 'What is use your phone?',
				id: 2,
			},
			{
				question: "This financial tool helps you track income and expenses so you don't spend more than you have.",
				answer: 'What is a budget?',
				id: 3,
			},
			{
				question:
					"When driving with friends in the car, you're responsible for their safety, which is why this phrase means you can always say no to distractions.",
				answer: 'What is my car, my rules?',
				id: 4,
			},
			{
				question:
					'Checking on a friend who seems down or helping a family member with chores without being asked shows this important quality.',
				answer: 'What is empathy?',
				id: 5,
			},
		],
	},
	{
		id: 3,
		title: 'World Geography',
		clues: [
			{
				question: 'This is the longest river in the world, flowing through 11 countries in Africa.',
				answer: 'What is the Nile River?',
				id: 1,
			},
			{
				question: 'This is the only continent that is also a country.',
				answer: 'What is Australia?',
				id: 2,
			},
			{
				question: 'The Ring of Fire, known for earthquakes and volcanoes, circles this ocean.',
				answer: 'What is the Pacific Ocean?',
				id: 3,
			},
			{
				question: 'This mountain range separates Europe from Asia and runs through Russia.',
				answer: 'What are the Ural Mountains?',
				id: 4,
			},
			{
				question: 'This desert is the largest hot desert in the world, covering much of North Africa.',
				answer: 'What is the Sahara Desert?',
				id: 5,
			},
		],
	},
	{
		id: 4,
		title: 'Growing Up Healthy',
		clues: [
			{
				question: 'You should shower and use deodorant every day, especially after this activity that makes you sweaty.',
				answer: 'What is exercise?',
				id: 1,
			},
			{
				question:
					'During puberty, your body produces more of these, which is why washing your face twice daily helps prevent acne.',
				answer: 'What are oils?',
				id: 2,
			},
			{
				question:
					'This is the minimum number of hours of sleep that teens need each night for proper growth and brain development.',
				answer: 'What is 8-10 hours?',
				id: 3,
			},
			{
				question:
					'A healthy relationship involves this quality where both people feel safe to share their thoughts and feelings honestly.',
				answer: 'What is communication?',
				id: 4,
			},
			{
				question:
					'If a friend pressures you to do something that makes you uncomfortable, this two-letter word is a complete sentence.',
				answer: 'What is no?',
				id: 5,
			},
		],
	},
	{
		id: 5,
		title: 'Natural Wonders',
		clues: [
			{
				question:
					"This natural light display is caused by solar particles colliding with Earth's atmosphere, visible near the poles.",
				answer: 'What is the Aurora Borealis?',
				id: 1,
			},
			{
				question: "This is the deepest point in Earth's oceans, located in the Pacific at nearly 36,000 feet deep.",
				answer: 'What is the Mariana Trench?',
				id: 2,
			},
			{
				question: 'This coral reef system off the coast of Australia is the largest living structure on Earth.',
				answer: 'What is the Great Barrier Reef?',
				id: 3,
			},
			{
				question: "This national park in Wyoming is home to over half of the world's geysers, including Old Faithful.",
				answer: 'What is Yellowstone National Park?',
				id: 4,
			},
			{
				question: 'This waterfall on the border of Zambia and Zimbabwe is considered one of the Seven Natural Wonders.',
				answer: 'What is Victoria Falls?',
				id: 5,
			},
		],
	},
	{
		id: 6,
		title: 'Making Good Choices',
		clues: [
			{
				question:
					'Before posting a photo or comment online, ask yourself if you would want this to still be visible in this many years.',
				answer: 'What is 10 years?',
				id: 1,
			},
			{
				question: 'If you make a mistake or hurt someone, this is the first step to making things right.',
				answer: 'What is apologize?',
				id: 2,
			},
			{
				question: "This is what you should do if you see someone being bullied, even if you're not the target.",
				answer: 'What is speak up or tell an adult?',
				id: 3,
			},
			{
				question:
					"When you're feeling peer pressure to do something risky, calling this person to pick you up is always the right choice.",
				answer: 'What is a parent or trusted adult?',
				id: 4,
			},
			{
				question: "Before believing or sharing something you see online, you should always do this first to check if it's true.",
				answer: 'What is verify it or fact-check?',
				id: 5,
			},
		],
	},
];

export default function getCategories() {
	const values = [200, 400, 600, 800, 1000];

	return categories.map(category => ({
		...category,
		clues: category.clues.map((clue, idx) => ({ ...clue, value: values[idx] })),
	}));
}
