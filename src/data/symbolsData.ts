export interface Symbol {
  id: string;
  emoji: string;
  text: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const categories: Category[] = [
  { id: 'phrases', name: 'Phrases', icon: '💬', color: 'hsl(152, 60%, 45%)' },
  { id: 'people', name: 'People', icon: '👤', color: 'hsl(200, 85%, 55%)' },
  { id: 'actions', name: 'Actions', icon: '🏃', color: 'hsl(270, 60%, 65%)' },
  { id: 'food', name: 'Food', icon: '🍎', color: 'hsl(15, 85%, 60%)' },
  { id: 'feelings', name: 'Feelings', icon: '😊', color: 'hsl(330, 70%, 60%)' },
  { id: 'places', name: 'Places', icon: '🏠', color: 'hsl(45, 95%, 55%)' },
  { id: 'things', name: 'Things', icon: '📦', color: 'hsl(180, 60%, 45%)' },
  { id: 'questions', name: 'Questions', icon: '❓', color: 'hsl(280, 60%, 55%)' },
  { id: 'time', name: 'Time', icon: '⏰', color: 'hsl(35, 90%, 50%)' },
  { id: 'health', name: 'Health', icon: '🏥', color: 'hsl(0, 70%, 55%)' },
  { id: 'nature', name: 'Nature', icon: '🌳', color: 'hsl(120, 50%, 45%)' },
];

export const symbols: Symbol[] = [
  // Phrases - Common expressions
  { id: 'yes', emoji: '✅', text: 'Yes', category: 'phrases' },
  { id: 'no', emoji: '❌', text: 'No', category: 'phrases' },
  { id: 'maybe', emoji: '🤷', text: 'Maybe', category: 'phrases' },
  { id: 'please', emoji: '🙏', text: 'Please', category: 'phrases' },
  { id: 'thank-you', emoji: '🙏', text: 'Thank you', category: 'phrases' },
  { id: 'sorry', emoji: '😔', text: 'Sorry', category: 'phrases' },
  { id: 'excuse-me', emoji: '🙋', text: 'Excuse me', category: 'phrases' },
  { id: 'hello', emoji: '👋', text: 'Hello', category: 'phrases' },
  { id: 'hi', emoji: '✌️', text: 'Hi', category: 'phrases' },
  { id: 'goodbye', emoji: '👋', text: 'Goodbye', category: 'phrases' },
  { id: 'bye', emoji: '✋', text: 'Bye', category: 'phrases' },
  { id: 'good-morning', emoji: '🌅', text: 'Good morning', category: 'phrases' },
  { id: 'good-afternoon', emoji: '☀️', text: 'Good afternoon', category: 'phrases' },
  { id: 'good-evening', emoji: '🌆', text: 'Good evening', category: 'phrases' },
  { id: 'good-night', emoji: '🌙', text: 'Good night', category: 'phrases' },
  { id: 'how-are-you', emoji: '👋', text: 'How are you?', category: 'phrases' },
  { id: 'im-fine', emoji: '😊', text: "I'm fine", category: 'phrases' },
  { id: 'im-good', emoji: '👍', text: "I'm good", category: 'phrases' },
  { id: 'whats-up', emoji: '🤙', text: "What's up?", category: 'phrases' },
  { id: 'see-you', emoji: '👀', text: 'See you', category: 'phrases' },
  { id: 'take-care', emoji: '💕', text: 'Take care', category: 'phrases' },
  { id: 'i-love-you', emoji: '❤️', text: 'I love you', category: 'phrases' },
  { id: 'i-miss-you', emoji: '💔', text: 'I miss you', category: 'phrases' },
  { id: 'help-me', emoji: '🆘', text: 'Help me', category: 'phrases' },
  { id: 'wait-please', emoji: '⏸️', text: 'Wait please', category: 'phrases' },
  { id: 'i-dont-know', emoji: '🤷', text: "I don't know", category: 'phrases' },
  { id: 'i-dont-understand', emoji: '😕', text: "I don't understand", category: 'phrases' },
  { id: 'say-again', emoji: '🔄', text: 'Say again', category: 'phrases' },
  { id: 'speak-slowly', emoji: '🐢', text: 'Speak slowly', category: 'phrases' },
  { id: 'its-okay', emoji: '👌', text: "It's okay", category: 'phrases' },
  { id: 'no-problem', emoji: '🤙', text: 'No problem', category: 'phrases' },
  { id: 'youre-welcome', emoji: '😊', text: "You're welcome", category: 'phrases' },
  { id: 'congratulations', emoji: '🎉', text: 'Congratulations', category: 'phrases' },
  { id: 'happy-birthday', emoji: '🎂', text: 'Happy birthday', category: 'phrases' },
  { id: 'well-done', emoji: '👏', text: 'Well done', category: 'phrases' },
  { id: 'be-careful', emoji: '⚠️', text: 'Be careful', category: 'phrases' },
  { id: 'i-agree', emoji: '🤝', text: 'I agree', category: 'phrases' },
  { id: 'i-disagree', emoji: '🙅', text: 'I disagree', category: 'phrases' },
  { id: 'of-course', emoji: '👌', text: 'Of course', category: 'phrases' },
  { id: 'never-mind', emoji: '😶', text: 'Never mind', category: 'phrases' },
  
  // Actions
  { id: 'lets-go', emoji: '🚀', text: "Let's go", category: 'actions' },
  { id: 'come-here', emoji: '🫴', text: 'Come here', category: 'actions' },
  { id: 'go-away', emoji: '👋', text: 'Go away', category: 'actions' },
  { id: 'leave-me-alone', emoji: '🚫', text: 'Leave me alone', category: 'actions' },
  { id: 'wait-for-me', emoji: '🏃', text: 'Wait for me', category: 'actions' },
  { id: 'hurry-up', emoji: '⚡', text: 'Hurry up', category: 'actions' },
  { id: 'slow-down', emoji: '🐢', text: 'Slow down', category: 'actions' },
  { id: 'stop-it', emoji: '🛑', text: 'Stop it', category: 'actions' },
  { id: 'be-quiet', emoji: '🤫', text: 'Be quiet', category: 'actions' },
  { id: 'listen-to-me', emoji: '👂', text: 'Listen to me', category: 'actions' },
  { id: 'look-at-me', emoji: '👀', text: 'Look at me', category: 'actions' },
  { id: 'follow-me', emoji: '🚶', text: 'Follow me', category: 'actions' },
  { id: 'stay-here', emoji: '📍', text: 'Stay here', category: 'actions' },
  { id: 'dont-go', emoji: '🚫', text: "Don't go", category: 'actions' },
  { id: 'come-back', emoji: '🔙', text: 'Come back', category: 'actions' },
  { id: 'try-again', emoji: '🔄', text: 'Try again', category: 'actions' },
  { id: 'good-job', emoji: '⭐', text: 'Good job', category: 'actions' },
  { id: 'keep-going', emoji: '💪', text: 'Keep going', category: 'actions' },
  { id: 'dont-worry', emoji: '😌', text: "Don't worry", category: 'actions' },
  { id: 'everything-is-fine', emoji: '✨', text: 'Everything is fine', category: 'actions' },
  
  // People
  { id: 'i', emoji: '🙋', text: 'I', category: 'people' },
  { id: 'you', emoji: '👉', text: 'You', category: 'people' },
  { id: 'we', emoji: '👥', text: 'We', category: 'people' },
  { id: 'they', emoji: '👫', text: 'They', category: 'people' },
  { id: 'mom', emoji: '👩', text: 'Mom', category: 'people' },
  { id: 'dad', emoji: '👨', text: 'Dad', category: 'people' },
  { id: 'family', emoji: '👨‍👩‍👧‍👦', text: 'Family', category: 'people' },
  { id: 'friend', emoji: '🤝', text: 'Friend', category: 'people' },
  { id: 'teacher', emoji: '👩‍🏫', text: 'Teacher', category: 'people' },
  { id: 'doctor', emoji: '👨‍⚕️', text: 'Doctor', category: 'people' },
  { id: 'nurse', emoji: '👩‍⚕️', text: 'Nurse', category: 'people' },
  { id: 'police', emoji: '👮', text: 'Police', category: 'people' },
  
  // Feelings
  { id: 'happy', emoji: '😊', text: 'Happy', category: 'feelings' },
  { id: 'sad', emoji: '😢', text: 'Sad', category: 'feelings' },
  { id: 'angry', emoji: '😠', text: 'Angry', category: 'feelings' },
  { id: 'scared', emoji: '😨', text: 'Scared', category: 'feelings' },
  { id: 'tired', emoji: '😫', text: 'Tired', category: 'feelings' },
  { id: 'excited', emoji: '🤩', text: 'Excited', category: 'feelings' },
  { id: 'bored', emoji: '😑', text: 'Bored', category: 'feelings' },
  { id: 'confused', emoji: '😕', text: 'Confused', category: 'feelings' },
  { id: 'surprised', emoji: '😲', text: 'Surprised', category: 'feelings' },
  { id: 'proud', emoji: '🥹', text: 'Proud', category: 'feelings' },
  { id: 'nervous', emoji: '😰', text: 'Nervous', category: 'feelings' },
  { id: 'calm', emoji: '😌', text: 'Calm', category: 'feelings' },
  
  // Food
  { id: 'hungry', emoji: '🍽️', text: 'I am hungry', category: 'food' },
  { id: 'thirsty', emoji: '💧', text: 'I am thirsty', category: 'food' },
  { id: 'water', emoji: '💧', text: 'Water', category: 'food' },
  { id: 'food', emoji: '🍽️', text: 'Food', category: 'food' },
  { id: 'breakfast', emoji: '🥞', text: 'Breakfast', category: 'food' },
  { id: 'lunch', emoji: '🥪', text: 'Lunch', category: 'food' },
  { id: 'dinner', emoji: '🍝', text: 'Dinner', category: 'food' },
  { id: 'snack', emoji: '🍿', text: 'Snack', category: 'food' },
  { id: 'fruit', emoji: '🍎', text: 'Fruit', category: 'food' },
  { id: 'drink', emoji: '🥤', text: 'Drink', category: 'food' },
  
  // Places
  { id: 'home', emoji: '🏠', text: 'Home', category: 'places' },
  { id: 'school', emoji: '🏫', text: 'School', category: 'places' },
  { id: 'hospital', emoji: '🏥', text: 'Hospital', category: 'places' },
  { id: 'bathroom', emoji: '🚽', text: 'Bathroom', category: 'places' },
  { id: 'bedroom', emoji: '🛏️', text: 'Bedroom', category: 'places' },
  { id: 'kitchen', emoji: '🍳', text: 'Kitchen', category: 'places' },
  { id: 'outside', emoji: '🌳', text: 'Outside', category: 'places' },
  { id: 'store', emoji: '🏪', text: 'Store', category: 'places' },
  { id: 'park', emoji: '🏞️', text: 'Park', category: 'places' },
  { id: 'car', emoji: '🚗', text: 'Car', category: 'places' },
  
  // Questions
  { id: 'what', emoji: '❓', text: 'What?', category: 'questions' },
  { id: 'where', emoji: '📍', text: 'Where?', category: 'questions' },
  { id: 'when', emoji: '⏰', text: 'When?', category: 'questions' },
  { id: 'who', emoji: '👤', text: 'Who?', category: 'questions' },
  { id: 'why', emoji: '🤔', text: 'Why?', category: 'questions' },
  { id: 'how', emoji: '💭', text: 'How?', category: 'questions' },
  { id: 'what-time', emoji: '⏰', text: 'What time is it?', category: 'questions' },
  { id: 'where-am-i', emoji: '📍', text: 'Where am I?', category: 'questions' },
  { id: 'can-you-help', emoji: '🙋', text: 'Can you help me?', category: 'questions' },
  { id: 'nice-to-meet', emoji: '🤝', text: 'Nice to meet you', category: 'questions' },
  
  // Health
  { id: 'i-need-help', emoji: '🆘', text: 'I need help', category: 'health' },
  { id: 'call-doctor', emoji: '👨‍⚕️', text: 'Call doctor', category: 'health' },
  { id: 'call-police', emoji: '👮', text: 'Call police', category: 'health' },
  { id: 'emergency', emoji: '🚨', text: 'Emergency', category: 'health' },
  { id: 'i-am-lost', emoji: '😰', text: 'I am lost', category: 'health' },
  { id: 'i-feel-sick', emoji: '🤒', text: 'I feel sick', category: 'health' },
  { id: 'i-am-tired', emoji: '😫', text: 'I am tired', category: 'health' },
  { id: 'i-need-bathroom', emoji: '🚽', text: 'I need bathroom', category: 'health' },
  { id: 'medicine', emoji: '💊', text: 'Medicine', category: 'health' },
  { id: 'pain', emoji: '😣', text: 'Pain', category: 'health' },
  { id: 'headache', emoji: '🤕', text: 'Headache', category: 'health' },
  { id: 'stomachache', emoji: '🤢', text: 'Stomachache', category: 'health' },
  
  // Time
  { id: 'now', emoji: '⏰', text: 'Now', category: 'time' },
  { id: 'later', emoji: '⏳', text: 'Later', category: 'time' },
  { id: 'today', emoji: '📅', text: 'Today', category: 'time' },
  { id: 'tomorrow', emoji: '📅', text: 'Tomorrow', category: 'time' },
  { id: 'yesterday', emoji: '📅', text: 'Yesterday', category: 'time' },
  { id: 'morning', emoji: '🌅', text: 'Morning', category: 'time' },
  { id: 'afternoon', emoji: '☀️', text: 'Afternoon', category: 'time' },
  { id: 'evening', emoji: '🌆', text: 'Evening', category: 'time' },
  { id: 'night', emoji: '🌙', text: 'Night', category: 'time' },
  { id: 'soon', emoji: '⏱️', text: 'Soon', category: 'time' },
  
  // Things
  { id: 'phone', emoji: '📱', text: 'Phone', category: 'things' },
  { id: 'book', emoji: '📚', text: 'Book', category: 'things' },
  { id: 'tv', emoji: '📺', text: 'TV', category: 'things' },
  { id: 'toy', emoji: '🧸', text: 'Toy', category: 'things' },
  { id: 'music', emoji: '🎵', text: 'Music', category: 'things' },
  { id: 'game', emoji: '🎮', text: 'Game', category: 'things' },
  { id: 'clothes', emoji: '👕', text: 'Clothes', category: 'things' },
  { id: 'shoes', emoji: '👟', text: 'Shoes', category: 'things' },
  { id: 'money', emoji: '💵', text: 'Money', category: 'things' },
  { id: 'key', emoji: '🔑', text: 'Key', category: 'things' },
  
  // Nature
  { id: 'sun', emoji: '☀️', text: 'Sun', category: 'nature' },
  { id: 'rain', emoji: '🌧️', text: 'Rain', category: 'nature' },
  { id: 'hot', emoji: '🥵', text: 'Hot', category: 'nature' },
  { id: 'cold', emoji: '🥶', text: 'Cold', category: 'nature' },
  { id: 'tree', emoji: '🌳', text: 'Tree', category: 'nature' },
  { id: 'flower', emoji: '🌸', text: 'Flower', category: 'nature' },
  { id: 'animal', emoji: '🐕', text: 'Animal', category: 'nature' },
  { id: 'bird', emoji: '🐦', text: 'Bird', category: 'nature' },
  { id: 'water-nature', emoji: '🌊', text: 'Water', category: 'nature' },
  { id: 'sky', emoji: '🌤️', text: 'Sky', category: 'nature' },
];

export const getSymbolsByCategory = (categoryId: string): Symbol[] => {
  return symbols.filter(symbol => symbol.category === categoryId);
};

export const getCategoryById = (categoryId: string): Category | undefined => {
  return categories.find(cat => cat.id === categoryId);
};
