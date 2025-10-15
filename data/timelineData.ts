import { TimelineEvent } from '../types';

export const timelineData: TimelineEvent[] = [
    { id: 'event1', year: 1895, title: 'First Public Film Screening', description: 'The Lumière brothers hold the first public, paid screening of a motion picture in Paris.', type: 'event' },
    { id: 'event2', year: 1927, title: 'The Jazz Singer', description: 'The first feature-length motion picture with synchronized dialogue, heralding the end of the silent era.', type: 'film' },
    { id: 'sunrise', year: 1927, title: 'Sunrise: A Song of Two Humans', description: 'F.W. Murnau brings German Expressionist techniques to Hollywood, creating a visual masterpiece of the late silent era.', type: 'film', link: 'film-studies' },
    { id: 'event3', year: 1939, title: 'Golden Age of Hollywood', description: 'The studio system is at its peak, with films like "The Wizard of Oz" and "Gone with the Wind" showcasing the power of Technicolor and the star system.', type: 'event' },
    { id: 'casablanca', year: 1942, title: 'Casablanca', description: 'A prime example of the classical Hollywood studio system, blending romance, propaganda, and star power during WWII.', type: 'film', link: 'film-studies' },
    { id: 'event4', year: 1959, title: 'French New Wave Begins', description: 'Films like Truffaut\'s "The 400 Blows" and Godard\'s "Breathless" revolutionize cinema with handheld cameras, jump cuts, and a rebellious spirit.', type: 'event' },
    { id: 'bonnie-clyde', year: 1967, title: 'Bonnie and Clyde', description: 'A landmark film of the "New Hollywood" movement, heavily influenced by the French New Wave.', type: 'film', link: 'film-studies' },
    { id: 'event5', year: 1977, title: 'Star Wars', description: 'George Lucas\'s film changes the industry, ushering in the age of the modern blockbuster, special effects, and film franchising.', type: 'film' },
    { id: 'do-the-right-thing', year: 1989, title: 'Do The Right Thing', description: 'Spike Lee\'s film marks a high point for modern independent cinema, tackling race in America with a bold, unique style.', type: 'film', link: 'film-studies' },
    { id: 'event6', year: 1995, title: 'Toy Story', description: 'Pixar releases the first feature-length computer-animated film, changing animation forever.', type: 'film' },
    { id: 'memento', year: 2000, title: 'Memento', description: 'Christopher Nolan\'s independent film showcases a complex, reverse-chronological narrative, a hallmark of postmodern and experimental filmmaking.', type: 'film', link: 'film-studies' },
];