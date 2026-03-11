import type { Category } from './types';

const categories = [
	{
		title: 'Animal Kingdom',
		clues: [
			{
				clue: 'This is the only mammal capable of true flight.',
				response: 'What is a bat?',
			},
			{
				clue: 'This animal can sleep standing up and only needs about 3 hours of sleep per day.',
				response: 'What is a horse?',
			},
			{
				clue: 'This bird is the fastest animal on Earth, reaching speeds over 240 mph when diving.',
				response: 'What is a peregrine falcon?',
			},
			{
				clue: 'This marine animal has three hearts and blue blood.',
				response: 'What is an octopus?',
			},
			{
				clue: 'This is the largest living land animal, weighing up to 14,000 pounds.',
				response: 'What is an elephant?',
			},
		],
	},
	{
		title: 'Life Skills 101',
		clues: [
			{
				clue: 'This is what you should do with 10-20% of any money you earn before spending on wants.',
				response: 'What is save it?',
			},
			{
				clue: 'When you start driving, this is the one thing you should never do while behind the wheel, even at red lights.',
				response: 'What is use your phone?',
			},
			{
				clue: "This financial tool helps you track income and expenses so you don't spend more than you have.",
				response: 'What is a budget?',
			},
			{
				clue: "When driving with friends in the car, you're responsible for their safety, which is why this phrase means you can always say no to distractions.",
				response: 'What is my car, my rules?',
			},
			{
				clue: 'Checking on a friend who seems down or helping a family member with chores without being asked shows this important quality.',
				response: 'What is empathy?',
			},
		],
	},
	{
		title: 'World Geography',
		clues: [
			{
				clue: 'This is the longest river in the world, flowing through 11 countries in Africa.',
				response: 'What is the Nile River?',
			},
			{
				clue: 'This is the only continent that is also a country.',
				response: 'What is Australia?',
			},
			{
				clue: 'The Ring of Fire, known for earthquakes and volcanoes, circles this ocean.',
				response: 'What is the Pacific Ocean?',
			},
			{
				clue: 'This mountain range separates Europe from Asia and runs through Russia.',
				response: 'What are the Ural Mountains?',
			},
			{
				clue: 'This desert is the largest hot desert in the world, covering much of North Africa.',
				response: 'What is the Sahara Desert?',
			},
		],
	},
	{
		title: 'Growing Up Healthy',
		clues: [
			{
				clue: 'You should shower and use deodorant every day, especially after this activity that makes you sweaty.',
				response: 'What is exercise?',
			},
			{
				clue: 'During puberty, your body produces more of these, which is why washing your face twice daily helps prevent acne.',
				response: 'What are oils?',
			},
			{
				clue: 'This is the minimum number of hours of sleep that teens need each night for proper growth and brain development.',
				response: 'What is 8-10 hours?',
			},
			{
				clue: 'A healthy relationship involves this quality where both people feel safe to share their thoughts and feelings honestly.',
				response: 'What is communication?',
			},
			{
				clue: 'If a friend pressures you to do something that makes you uncomfortable, this two-letter word is a complete sentence.',
				response: 'What is no?',
			},
		],
	},
	{
		title: 'Natural Wonders',
		clues: [
			{
				clue: "This natural light display is caused by solar particles colliding with Earth's atmosphere, visible near the poles.",
				response: 'What is the Aurora Borealis?',
			},
			{
				clue: "This is the deepest point in Earth's oceans, located in the Pacific at nearly 36,000 feet deep.",
				response: 'What is the Mariana Trench?',
			},
			{
				clue: 'This coral reef system off the coast of Australia is the largest living structure on Earth.',
				response: 'What is the Great Barrier Reef?',
			},
			{
				clue: "This national park in Wyoming is home to over half of the world's geysers, including Old Faithful.",
				response: 'What is Yellowstone National Park?',
			},
			{
				clue: 'This waterfall on the border of Zambia and Zimbabwe is considered one of the Seven Natural Wonders.',
				response: 'What is Victoria Falls?',
			},
		],
	},
	{
		title: 'Making Good Choices',
		clues: [
			{
				clue: 'Before posting a photo or comment online, ask yourself if you would want this to still be visible in this many years.',
				response: 'What is 10 years?',
			},
			{
				clue: 'If you make a mistake or hurt someone, this is the first step to making things right.',
				response: 'What is apologize?',
			},
			{
				clue: "This is what you should do if you see someone being bullied, even if you're not the target.",
				response: 'What is speak up or tell an adult?',
			},
			{
				clue: "When you're feeling peer pressure to do something risky, calling this person to pick you up is always the right choice.",
				response: 'What is a parent or trusted adult?',
			},
			{
				clue: "Before believing or sharing something you see online, you should always do this first to check if it's true.",
				response: 'What is verify it or fact-check?',
			},
		],
	},
];

export default function getCategories(): Category[] {
	const values = [200, 400, 600, 800, 1000];

	return categories.map(category => ({
		...category,
		id: crypto.randomUUID(),
		clues: category.clues.map((clue, idx) => ({ ...clue, id: crypto.randomUUID(), value: values[idx] })),
	}));
}
