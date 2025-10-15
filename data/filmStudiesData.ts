import { FilmConceptCategory, FilmPaper, ResourceItem } from '../types';

export const filmConceptsData: FilmConceptCategory[] = [
    {
        id: 'key-concepts',
        title: 'Film Form, Meaning & Response',
        concepts: [
            {
                id: 'cinematography',
                title: 'Cinematography & Lighting',
                overview: 'The art and process of motion-picture photography. It involves every decision made with the camera, from how a subject is framed to the type of lighting used. It is the foundation of a film\'s visual language.',
                notes: [
                    "**SHOT TYPES**",
                    "- **Establishing Shot:** A wide shot that defines the context and space of the scene. Often a Long Shot or Extreme Long Shot at the beginning of a sequence. **Example:** The sweeping shots of the vast American landscape in *Nomadland* establish Fern's isolation and the scale of her journey.",
                    "- **Extreme Long Shot (ELS):** Shows the subject from a great distance, emphasizing the environment and making the subject seem small or insignificant. **Example:** Fern's van appearing as a tiny spec in the huge American landscape in *Nomadland*.",
                    "- **Long Shot (LS):** Shows the full human figure from head to toe, allowing the audience to see their movement and relationship to the setting.",
                    "- **Medium Shot (MS):** Shows the subject from the waist up. A common, neutral shot for conversations that balances character with context.",
                    "- **Close-Up (CU):** Fills the screen with the subject's face, showing emotion in detail and creating intimacy. **Example:** The intense close-ups on Eva's face in *We Need to Talk About Kevin* convey her psychological torment and isolation.",
                    "- **Extreme Close-Up (ECU):** Focuses on a single detail, like the eyes or an object, for dramatic emphasis. Often used to highlight a key symbol or a character's intense emotional state.",
                    "- **Point of View (POV) Shot:** Shows the scene from a character's direct perspective. This is a powerful tool for creating spectator alignment. **Example:** Hitchcock's use of POV in *Vertigo* forces the audience into Scottie's obsessive gaze as he follows Madeleine.",
                    "**CAMERA ANGLES**",
                    "- **Low Angle:** The camera looks up at the subject, making them seem powerful, dominant, or threatening. **Example:** Used on the police officers in *Do the Right Thing* to emphasize their authority and create a sense of intimidation.",
                    "- **High Angle:** The camera looks down on the subject, making them seem weak, vulnerable, or trapped by their environment.",
                    "- **Canted Angle (Dutch Tilt):** The camera is tilted on its axis, making the world look off-balance. It creates a sense of unease, tension, or psychological distress. **Example:** Spike Lee's constant use of canted angles in *Do the Right Thing* to reflect the escalating racial tensions.",
                    "- **Eye-Level Shot:** A neutral angle that creates a sense of equality and direct connection with the character, simulating a normal human viewpoint.",
                    "**CAMERA MOVEMENT**",
                    "- **Pan:** The camera swivels horizontally from a fixed point to scan a space or follow a subject.",
                    "- **Tilt:** The camera swivels vertically from a fixed point, often used to reveal something or emphasize height.",
                    "- **Tracking Shot (Dolly):** The camera physically moves on a track, often alongside a character. Creates a smooth, immersive feeling. **Example:** The long tracking shots in *City of God* that plunge the viewer into the chaotic energy of the favela.",
                    "- **Crane Shot:** The camera moves up or down on a crane, often used for dramatic establishing shots or reveals.",
                    "- **Handheld:** The camera is held by the operator, creating a shaky, unstable image. This imparts a sense of realism, immediacy, or chaos. **Example:** The dominant style in *Fish Tank*, creating an intimate, subjective perspective that locks the audience into Mia's volatile world.",
                    "- **Steadicam:** A mounted camera that allows for smooth, fluid movement, combining the mobility of handheld with the stability of a dolly. Often used for long, complex following shots.",
                    "**LIGHTING TECHNIQUES**",
                    "- **Three-Point Lighting:** The standard Hollywood setup for creating a clear, glamorous image. It consists of a **Key Light** (main, brightest light), a **Fill Light** (to soften shadows created by the key), and a **Backlight** (to separate the subject from the background).",
                    "- **High-Key Lighting:** Bright, even lighting with low contrast and few shadows. Creates a cheerful, optimistic, or clean mood. Common in comedies and musicals like *La La Land*.",
                    "- **Low-Key Lighting:** Dark, shadowy lighting with high contrast between light and dark areas. Creates a mood of mystery, suspense, and danger. The signature style of film noir and horror films. **Example:** The shadowy interiors of Rick's Café in *Casablanca*.",
                    "- **Chiaroscuro:** An extreme version of low-key lighting with dramatic, high-contrast areas of light and deep shadow. Often used to show a character's moral ambiguity or inner conflict."
                ],
            },
            {
                id: 'mise-en-scene',
                title: 'Mise-en-scène',
                overview: 'A French term meaning "placing on stage." It refers to everything that is put into the frame of a shot. If cinematography is *how* we see, mise-en-scène is *what* we see. It is the art of visual storytelling within the frame.',
                notes: [
                    "**CORE ELEMENTS**",
                    "- **Setting & Location:** The physical environment where the story takes place. Can be a real location or a constructed set. The setting is crucial for establishing mood, genre, and character. **Example:** The sterile, ordered hospital ward in *One Flew Over the Cuckoo's Nest* visually represents Nurse Ratched's oppressive control.",
                    "- **Props (Properties):** Objects within the setting that have a function in the story. A prop can become a powerful **motif** if it is repeated. **Example:** In *Citizen Kane*, the 'Rosebud' sled is a key prop that symbolizes Kane's lost innocence.",
                    "- **Costume, Hair & Makeup:** The appearance of the characters tells the audience a great deal about their personality, status, and their emotional state. **Example:** In *Joker*, Arthur's transformation is charted through his increasingly chaotic makeup and flamboyant suit.",
                    "- **Figure Expression & Movement:** How an actor moves, their posture, and their facial expressions. This is a key part of performance. **Example:** The contrast between Margo Channing's grand, theatrical gestures and Eve Harrington's quiet, watchful stillness in *All About Eve*.",
                    "- **Colour Palette:** The overall use of colour in a film. A desaturated palette can create a bleak mood (*Nomadland*). A highly saturated palette can create a sense of fantasy or heightened emotion (*La La Land*). In *Vertigo*, the colour green is a motif consistently associated with the ghostly Madeleine.",
                    "**AESTHETIC STYLES**",
                    "- **Naturalism/Realism:** The mise-en-scène aims for a believable, true-to-life depiction of the world. This is the dominant style in social realist films like *This is England* and *Fish Tank*.",
                    "- **Expressionism:** The visual elements are stylized to externalize a character's inner emotional state or to create a particular mood. **Example:** The fantastical, uterine-like lair of the Faun in *Pan's Labyrinth* is an expression of the dark, fairytale world that mirrors the brutality of the real world."
                ],
            },
            {
                id: 'editing',
                title: 'Editing (Montage)',
                overview: 'The process of selecting and joining shots to create a coherent sequence. Editing shapes a film\'s pace, rhythm, and structure, and is crucial in constructing meaning.',
                notes: [
                    "**CONTINUITY EDITING ('THE INVISIBLE STYLE')**",
                    "- **180-Degree Rule:** An imaginary line is drawn between two characters in a scene. By keeping the camera on one side of this line, their positions in the frame remain consistent, avoiding audience confusion.",
                    "- **Shot/Reverse-Shot:** A standard technique for filming conversations, cutting between two characters as they speak.",
                    "- **Eyeline Match:** A cut that shows a character looking at something, followed by a shot of what they are looking at. This directs the audience's attention and creates a logical flow.",
                    "- **Match-on-Action:** A cut that joins two different shots of the same action, making the movement appear continuous and seamless.",
                    "**TRANSITIONS**",
                    "- **Cut:** The most common transition, an instantaneous change from one shot to the next.",
                    "- **Dissolve:** One shot gradually fades out while the next shot gradually fades in, with the two images briefly overlapping. Often used to show the passage of time.",
                    "- **Fade (In/Out):** Fading a shot to or from a single colour, usually black. A fade-out often signifies the end of a major scene.",
                    "- **Wipe:** One shot pushes the other off the screen. A more stylized and noticeable transition.",
                    "**DISCONTINUITY & EXPRESSIVE EDITING**",
                    "- **Jump Cut:** Removing a section from a single continuous shot, creating a jarring 'jump' in time that breaks continuity. Popularized by the French New Wave. **Example:** Used in *Cléo from 5 to 7* to create a sense of unease and draw attention to the filmmaking process.",
                    "- **Montage:** Juxtaposing a series of shots to create a new meaning. A **Hollywood Montage** typically compresses a long period of time (*Rocky* training). **Soviet Montage**, however, used the clash of images to generate political ideas (the **Kuleshov Effect**).",
                    "- **Cross-Cutting (Parallel Editing):** Cutting between two or more different scenes happening at the same time in different locations to build tension. **Example:** Cutting between the heroes trying to defuse a bomb and the timer counting down.",
                    "**TEMPORAL EDITING (MANIPULATING TIME)**",
                    "- **Slow Motion:** Slowing down the action for dramatic or emotional emphasis. **Example:** The brutal final ambush in *Bonnie and Clyde* is filmed in slow motion to heighten its impact.",
                    "- **Fast Motion (Accelerated):** Speeding up the action, often for comedic effect.",
                    "- **Flashback / Flashforward:** Cutting to a scene from the past or future. **Example:** *All About Eve* uses a complex flashback structure to tell its story."
                ],
            },
            {
                id: 'sound',
                title: 'Sound',
                overview: 'Everything the audience hears in a film, including dialogue, music, and sound effects. Sound is a powerful, often subconscious, tool for creating atmosphere and shaping the audience\'s emotional response.',
                notes: [
                    "**TYPES OF SOUND**",
                    "- **Diegetic Sound:** Sound that originates from within the film's world. The characters can hear it. This includes **dialogue**, **sound effects** (like footsteps, a door slamming), and **ambient sound** (the background noise of a location).",
                    "- **Non-Diegetic Sound:** Sound that is added for the audience and does not exist in the film's world. The characters cannot hear it. This is typically the **musical score** or a narrator's **voiceover**. **Example:** The voiceover narration by Rocket in *City of God* is non-diegetic.",
                    "- **Internal Diegetic Sound:** A character's internal thoughts, heard as a voiceover. It is diegetic because it comes from the character's mind, but other characters cannot hear it.",
                    "**KEY SOUND TECHNIQUES**",
                    "- **Sound Bridge:** An editing technique where the sound from the next scene begins before the visuals cut (a **J-Cut**), or the sound from the current scene carries over into the next (an **L-Cut**). This links scenes together and creates a smooth flow.",
                    "- **Parallel Sound:** The sound (usually music) matches the mood of the scene. **Example:** Tense, dramatic music during a chase sequence.",
                    "- **Contrapuntal Sound:** The sound deliberately contrasts with the image, creating an ironic or unsettling effect. **Example:** The use of jaunty, upbeat old-timey music during scenes of ultra-violence in Stanley Kubrick's *A Clockwork Orange*.",
                    "- **Sound Motif:** A recurring sound effect or piece of music that becomes associated with a particular character, location, or idea. **Example:** The iconic two-note shark theme in *Jaws*.",
                    "- **Foley:** The art of creating everyday sound effects (footsteps, cloth rustling, punches) in a recording studio and adding them to the film in post-production to enhance the audio.",
                ],
            },
            {
                id: 'performance',
                title: 'Performance',
                overview: 'The work of an actor or group of actors to create characters in a film. Performance is conveyed through a combination of facial expression, body language, gesture, and vocal delivery.',
                notes: [
                    "**ELEMENTS OF PERFORMANCE**",
                    "- **Vocal Delivery:** The way an actor uses their voice, including **tone** (the emotion conveyed), **pitch** (high or low), **pace** (fast or slow), and **volume**. **Example:** Nurse Ratched in *One Flew Over the Cuckoo's Nest* uses a calm, flat, and chillingly controlled vocal tone to exert her authority.",
                    "- **Physical Expression:** How an actor uses their body. This includes **posture**, **gesture**, and **body language**. **Example:** The awkward, hunched posture of Arthur Fleck in *Joker* communicates his low self-esteem and alienation.",
                    "- **Facial Expression:** The most direct way of conveying a character's thoughts and emotions. A subtle glance or a raised eyebrow can speak volumes. The close-up shot is essential for capturing this.",
                    "**PERFORMANCE STYLES**",
                    "- **Naturalistic / Realist Acting:** A subtle and restrained style that aims for believability and psychological truth. Common in social realist films.",
                    "- **Method Acting:** A technique where the actor attempts to fully immerse themselves in the character's emotional life, often drawing on their own past experiences. **Example:** Joaquin Phoenix's dramatic weight loss and intense psychological preparation for *Joker*.",
                    "- **Stylized / Expressionistic Acting:** An exaggerated, non-naturalistic style often used in genre films or by specific directors. Common in silent films, where emotion had to be conveyed physically. **Example:** The performances in German Expressionist films.",
                    "**THE SIGNIFICANCE OF CASTING**",
                    "- **Typecasting:** When an actor is repeatedly cast in similar roles based on their appearance or previous success.",
                    "- **Star Persona:** The set of associations and expectations an audience has for a major star, which they bring to every role. **Example:** In *Vertigo*, casting James Stewart, known for his decent 'everyman' roles, makes his character's dark obsession all the more disturbing."
                ],
            },
            {
                id: 'meaning-response',
                title: 'Meaning and Response',
                overview: 'How films function as both a medium of representation (constructing our view of the world) and as an aesthetic medium (an art form with its own unique qualities).',
                notes: [
                    "**Film as Representation**",
                    "- Films do not simply show reality; they **construct** a version of it. The selection and combination of all elements of film form contribute to representing people, places, and ideas in a particular way. These representations are often ideological. **Example:** *Do the Right Thing* constructs a representation of a specific Black community and the racial tensions of its time.",
                    "**Ideological Nature of Representation**",
                    "- Representations can either reinforce or challenge dominant societal values (hegemony). **Stereotypes** are oversimplified and often negative representations that reinforce prejudice. Films can offer **counter-representations** that challenge these norms, like *Moonlight*’s tender portrayal of Black masculinity.",
                    "**Film as an Aesthetic Medium**",
                    "- This refers to the appreciation of film for its artistic qualities – the beauty of its cinematography, the creativity of its mise-en-scène, the rhythm of its editing. It is about how the film form creates a sensory and emotional experience for the viewer.",
                    "**Spectacle vs. Narrative**",
                    "- There can be a tension between the 'wow' factor of aesthetic spectacle (e.g., a massive CGI action sequence) and the drive to tell a coherent story. Some films prioritize one over the other. The musical numbers in *La La Land* are moments of pure aesthetic spectacle that temporarily pause the narrative.",
                    "**Generating Response**",
                    "- Filmmakers use film form to generate specific emotional and intellectual responses from the spectator. Horror films use low-key lighting and jump cuts to create fear. Melodramas like *Imitation of Life* use music and emotional close-ups to provoke tears."
                ],
            },
            {
                id: 'contexts',
                title: 'The Contexts of Film',
                overview: 'Films are not created in a vacuum. They are shaped by the social, cultural, political, and industrial circumstances of their production and reception. Understanding context is crucial for a deeper analysis.',
                notes: [
                    "**Social & Cultural Context**",
                    "- The societal values, debates, and cultural trends of the time a film is made. **Example:** *Bonnie and Clyde* (1967) is a product of the 1960s counter-culture, reflecting its anti-establishment attitudes. *Get Out* (2017) is a response to the social context of 'post-racial' America and the Black Lives Matter movement.",
                    "**Political Context**",
                    "- How political events or ideologies influence a film. **Example:** *Casablanca* (1942) was made during WWII and served as propaganda to encourage American intervention. The Cold War context is essential for understanding the paranoia in many 1950s sci-fi films.",
                    "**Institutional / Production Context**",
                    "- The industry in which the film was made. Was it a big-budget Hollywood studio film or a low-budget independent film? The **Hollywood studio system** (*Casablanca*) operated like a factory with immense resources but strict creative controls (the Hays Code). **Independent cinema** (*Night of the Living Dead*) often has more creative freedom but fewer resources.",
                    "**Technological Context**",
                    "- The technology available at the time of production. The advent of lightweight cameras influenced the French New Wave. The development of CGI has transformed the modern blockbuster. *Sunrise* (1927) was a masterpiece of silent film technology, while *The Jazz Singer* (1927) marked the beginning of the sound era.",
                    "**Reception Context**",
                    "- How a film is received can change over time. *Vertigo* was a flop on release but is now considered a masterpiece. This shows how a film's meaning and value are not fixed, but are re-negotiated by different audiences in different contexts."
                ],
            },
        ],
    },
];

export const filmPapersData: FilmPaper[] = [
    {
        id: 'paper-1',
        title: 'Component 1: Varieties of film and filmmaking',
        categories: [
            {
                id: 'p1-sA-g1',
                title: 'Section A: Hollywood 1930-1990 — Group 1: Classical Hollywood',
                films: [
                    {
                        id: 'casablanca', title: 'Casablanca', director: 'Michael Curtiz', year: 1942, imageUrl: 'https://i.pinimg.com/736x/b3/90/9b/b3909bc26dbc1e2ee944eec0bf2fb326.jpg',
                        synopsis: 'In WWII Casablanca, cynical American expatriate Rick Blaine must choose between his love for a woman from his past, Ilsa, and helping her and her Resistance leader husband escape from the Nazis.',
                        keyFacts: { context: 'Classical Hollywood Studio Era', 'Specialist Study': 'Auteur & Context' },
                        revisionNotes: [
                          "**Context:**",
                          "   - **Production Context:** Produced by Warner Bros. during the height of the Hollywood studio system. This system operated like a factory, with stars, directors, and writers all under long-term contracts. Michael Curtiz was a versatile 'house director', not a typical auteur, known for his efficiency and ability to work across genres.",
                          "   - **Historical Context:** Made during WWII, before the US had officially entered the conflict. The film functioned as effective propaganda, encouraging American interventionism and demonizing the Nazis. Rick's personal journey from cynical isolationism ('I stick my neck out for nobody') to heroic commitment mirrors America's own political shift from neutrality to involvement in the war.",
                          "**Film Form Analysis:**",
                          "   - **Cinematography:** Utilises classic film noir aesthetics with low-key lighting and dramatic shadows, influenced by German Expressionism (brought to Hollywood by emigre directors like Curtiz). A special gauze filter was famously used on Ingrid Bergman's close-ups to make her eyes sparkle, a classic studio technique to enhance star quality.",
                          "   - **Mise-en-scène:** Rick's Café Américain is a key setting, a microcosm of the world at war, filled with refugees, collaborators, and spies. The symbolism of the Vichy water bottle being thrown away by the French prefect is a powerful moment.",
                          "   - **Sound:** The song 'As Time Goes By' functions as a powerful non-diegetic and diegetic motif, triggering memories and representing Rick and Ilsa's lost love. The score masterfully blends romantic themes with patriotic anthems.",
                          "**Analysis of 3 Key Scenes:**",
                          "   - **1. The 'La Marseillaise' Scene:** Laszlo leads the café in singing the French national anthem to drown out the Germans. This is a powerful moment of collective defiance. The editing cuts between the emotional, tear-filled faces of the French refugees, creating an overwhelming sense of unity and patriotism. The camera dramatically pushes in on Ilsa's face, linking the personal and political struggle.",
                          "   - **2. The 'Play it, Sam' Scene:** A drunken Rick is confronted by the memory of Ilsa. Classic film noir aesthetic is used. Extreme low-key lighting and shadows externalize Rick's inner turmoil. The flashback to Paris uses soft, high-key lighting to create a stark contrast between the idyllic past and the dark present.",
                          "   - **3. The Final Airport Scene:** Rick sacrifices his love for the greater good. The dense fog in the mise-en-scène creates a sense of moral ambiguity and uncertainty, but also allows Rick to control the situation and eliminate Major Strasser. Rick's transformation is completed as he walks off with Renault, cementing the film's ideological message of heroic sacrifice.",
                          "**Character Analysis:**",
                          "   - **Rick Blaine (Humphrey Bogart):** His character arc is the core of the film. He transforms from a bitter, self-interested isolationist into a selfless, noble hero. Bogart's star persona as the tough but vulnerable leading man was cemented by this role.",
                          "   - **Ilsa Lund (Ingrid Bergman):** Represents the heart and moral conflict of the film, torn between her past love for Rick and her present duty to Laszlo and the Resistance. She is portrayed as both strong and vulnerable.",
                          "**Specialist Study Area: Auteur & Context:**",
                          "   - The 'auteur' of *Casablanca* is debatable. Is it director Michael Curtiz, with his expressive visual style? Is it the screenwriters, who created the iconic dialogue? Or is it the studio system itself, which perfected a formula of stars, genre, and narrative efficiency? It can be argued the film's primary 'author' is its historical context; its meaning and power are inseparable from WWII."
                        ]
                    },
                    {
                        id: 'all-about-eve', title: 'All About Eve', director: 'Joseph L. Mankiewicz', year: 1950, imageUrl: 'https://i.pinimg.com/1200x/0e/1e/8a/0e1e8a66d1652d76a2002369a623e674.jpg',
                        synopsis: 'An ingenue, Eve Harrington, insinuates herself into the life of an aging Broadway star, Margo Channing, ruthlessly manipulating her way to the top of the theatre world.',
                        keyFacts: { context: 'Late Classical Hollywood', 'Specialist Study': 'Auteur & Context' },
                        revisionNotes: [
                            "**Context:**",
                            "   - Produced at the tail-end of the studio system's golden age. The rise of television was beginning to threaten cinema's dominance, and the film's cynical, behind-the-scenes look at the world of show business reflects this industry anxiety. It explores themes of ambition, betrayal, aging, and the role of women in a competitive, male-dominated industry.",
                            "**Film Form Analysis:**",
                            "   - **Narrative:** Uses a complex, non-linear flashback structure, narrated by multiple characters (the cynical critic Addison DeWitt and Margo's friend Karen). This creates layers of perspective and unreliability, framing the story as a cautionary tale.",
                            "   - **Sound:** The film is dialogue-heavy, showcasing Mankiewicz's Oscar-winning screenplay. The witty, sharp, and cynical lines are the main driving force of the film. The non-diegetic score is used to heighten the melodrama.",
                            "**Analysis of 3 Key Scenes:**",
                            "   - **1. Margo's Party:** Margo's famous line, 'Fasten your seatbelts, it's going to be a bumpy night,' signals the start of her drunken breakdown. The scene masterfully builds tension through dialogue and performance as Margo sees Eve charming everyone, realizing she is being usurped.",
                            "   - **2. The Dressing Room Confrontation:** After Eve has schemed her way into becoming Margo's understudy, Margo confronts her. The scene uses shot/reverse-shot to highlight the power struggle, with Margo's righteous anger contrasting with Eve's feigned innocence.",
                            "   - **3. The Final Scene:** Eve, now a star, returns to her apartment to find a young aspiring actress, Phoebe, who mirrors her own younger self. The final shot of Phoebe holding Eve's award and bowing to her own reflection in a three-way mirror is a powerful visual metaphor, suggesting the cycle of ambition and betrayal is never-ending.",
                            "**Character Analysis:**",
                            "   - **Margo Channing (Bette Davis):** A complex character who is at once a powerful star and deeply insecure about her age and career. Davis's performance is iconic, blurring the line between the character and her own star persona as a formidable actress.",
                            "   - **Eve Harrington (Anne Baxter):** The ultimate manipulator, she represents ruthless, sociopathic ambition. Her transformation from a seemingly meek 'admirer' to a cold, calculating star is the central focus of the narrative.",
                            "**Specialist Study Area: Auteur & Context:**",
                            "   - Joseph L. Mankiewicz was a writer-director, and his 'signature' is the witty, cynical, and highly literate dialogue that dominates the film. His authorial voice is clear in the film's sharp critique of ambition and the phoniness of show business.",
                            "   - The context of the end of the studio system and the threat of television looms large. Margo's fear of being replaced by a younger model reflects Hollywood's own anxieties at the time."
                        ]
                    },
                    {
                        id: 'vertigo', title: 'Vertigo', director: 'Alfred Hitchcock', year: 1958, imageUrl: 'https://i.pinimg.com/1200x/10/bd/2d/10bd2d166a27de5c8649e3b216c8b19b.jpg',
                        synopsis: 'A former police detective, \'Scottie\' Ferguson, who suffers from a crippling fear of heights, is hired to follow a woman who appears to be possessed by the past, leading him into a dark web of obsession and deceit.',
                        keyFacts: { context: 'Late Classical Hollywood', 'Specialist Study': 'Auteur & Context' },
                        revisionNotes: [
                          "**Context:**",
                          "   - **Reception:** On its release, *Vertigo* was a critical and commercial disappointment. It was only through re-evaluation in later decades that it became regarded as a masterpiece and is now often cited as one of the greatest films ever made.",
                          "   - **Psychological Context:** The film taps into the psychological anxieties and obsessions of the post-war Freudian era, exploring themes of identity, memory, trauma, and male obsession (specifically necrophilia - a desire for the dead).",
                          "**Film Form Analysis:**",
                          "   - **Cinematography & Colour:** The use of colour is highly symbolic. Green is associated with Madeleine, ghosts, and the supernatural, bathing her in an ethereal glow. Red is linked to danger and Scottie's obsession. The pioneering 'dolly zoom' (or 'Vertigo effect') visually represents Scottie's acrophobia.",
                          "   - **Sound:** Bernard Herrmann's haunting, swirling score is essential to the film's hypnotic and unsettling atmosphere. The music mimics Scottie's spiraling obsession and psychological descent.",
                          "**Analysis of 3 Key Scenes:**",
                          "   - **1. Scottie Follows Madeleine:** A long, dialogue-free sequence where Scottie silently follows Madeleine around San Francisco. Hitchcock uses subjective point-of-view shots, forcing the audience to share Scottie's obsessive, voyeuristic gaze. We become complicit in his watching.",
                          "   - **2. The 'Transformation' Scene:** After finding Judy, Scottie obsessively tries to remake her into the image of the dead Madeleine. The scene climaxes as Judy emerges from the bathroom, bathed in an eerie green light from a neon sign, appearing like a ghost. It is a deeply disturbing moment of male control and psychological dominance.",
                          "   - **3. The Bell Tower Climax:** Scottie finally overcomes his vertigo, but his 'cure' leads to tragedy as Judy falls to her death. The final shot of Scottie looking down from the tower is famously ambiguous, leaving his fate and psychological state unresolved.",
                          "**Character Analysis:**",
                          "   - **'Scottie' Ferguson (James Stewart):** A deconstruction of Stewart's 'everyman' persona. Scottie is a deeply flawed protagonist, whose obsession and desire to control women lead to destruction. He is both a victim and a perpetrator.",
                          "   - **Madeleine/Judy (Kim Novak):** A dual role representing two facets of male fantasy: the ethereal, mysterious object of desire (Madeleine) and the ordinary, working-class woman (Judy). She is ultimately a tragic victim of the male characters' manipulations.",
                          "**Specialist Study Area: Auteur & Context:**",
                          "   - The film is pure Hitchcock, dealing with his recurring themes of voyeurism, psychological obsession, mistaken identity, and the 'cool blonde' archetype. Many critics read the film as a deeply personal and self-reflexive work, with Scottie's obsessive desire to mold Judy into his ideal woman mirroring Hitchcock's own controlling relationships with his actresses."
                        ]
                    },
                    {
                        id: 'imitation-of-life', title: 'Imitation of Life', director: 'Douglas Sirk', year: 1959, imageUrl: 'https://i.pinimg.com/1200x/ac/85/2b/ac852b4b65b13cb72eb3f61a1b9eada5.jpg',
                        synopsis: 'A struggling white actress takes in an African American widow and her light-skinned daughter, as their intertwined stories challenge the racial and social conventions of the 1950s.',
                        keyFacts: { context: 'Classic Hollywood Melodrama', 'Specialist Study': 'Auteur & Context' },
                        revisionNotes: [
                          "**Context:**",
                          "   - **Social Context:** Released in 1959, on the cusp of the Civil Rights Movement. The film tackles the taboo subjects of race, passing (a light-skinned Black person passing as white), class, and single motherhood in a way that was highly unusual for mainstream Hollywood.",
                          "   - **Genre Context:** A classic example of the 'melodrama' or 'woman's picture', a genre that uses heightened emotion, dramatic plot twists, and a focus on domestic life to explore social issues often ignored by other genres.",
                          "**Film Form Analysis:**",
                          "   - **Mise-en-scène:** Sirk uses mirrors, windows, and frames within the frame to visually suggest his characters are trapped by societal expectations. The glossy, vibrant Technicolor and luxurious sets create a surface of perfection that masks the emotional turmoil and social injustice underneath. This is a key part of his critical style.",
                          "   - **Symbolism:** The staircase in Lora's home is a recurring motif, symbolizing the class divide between her and Annie. The final funeral scene, with Mahalia Jackson singing 'Trouble of the World', is a moment of pure, powerful melodrama.",
                          "**Analysis of 3 Key Scenes:**",
                          "   - **1. Sarah Jane's Classroom:** Sarah Jane's mother, Annie, visits her at school, and Sarah Jane is horrified because Annie's presence reveals to her classmates that she is Black. The scene poignantly captures the internalised racism and shame that Sarah Jane feels.",
                          "   - **2. Sarah Jane's Nightclub Beating:** Sarah Jane is discovered working in a seedy nightclub, passing as white. Her white boyfriend brutally beats her when he learns her secret. This is a shocking moment of violence that exposes the brutal reality of racism.",
                          "   - **3. Annie's Funeral:** Sarah Jane returns, filled with guilt, and throws herself on her mother's coffin in a public display of grief and regret. It is a moment of extreme emotional catharsis, typical of the melodrama genre, designed to provoke a powerful emotional response from the audience.",
                          "**Character Analysis:**",
                          "   - **Lora Meredith (Lana Turner):** Represents white ambition and self-absorption. She achieves her dream of stardom but neglects her daughter and is blind to the suffering of her friend, Annie.",
                          "   - **Annie Johnson (Juanita Moore):** The film's moral centre. She is a figure of quiet dignity and self-sacrifice, representing the suffering and resilience of Black women.",
                          "   - **Sarah Jane Johnson (Susan Kohner):** A tragic and complex character. Her desire to 'pass' as white is a desperate attempt to escape the confines of a racist society. She is both a victim and a source of pain.",
                          "**Specialist Study Area: Auteur & Context:**",
                          "   - Douglas Sirk is considered the master of Hollywood melodrama. His auteur signature is his use of a highly expressive, stylized, and almost artificial visual aesthetic to critique the emptiness of the American Dream and the hypocrisy of 1950s society. He uses the glossy surface of Hollywood to reveal the ugly truth underneath, a technique known as 'Sirkian irony'."
                        ]
                    },
                    {
                        id: 'some-like-it-hot', title: 'Some Like It Hot', director: 'Billy Wilder', year: 1959, imageUrl: 'https://i.pinimg.com/736x/8c/eb/f4/8cebf47c1162ab5d2d9bff563aab9a76.jpg',
                        synopsis: 'After witnessing a mob hit, two male musicians, Joe and Jerry, disguise themselves as women and join an all-female band to escape from the gangsters pursuing them.',
                        keyFacts: { context: 'Late Classical Hollywood / Comedy', 'Specialist Study': 'Auteur & Context' },
                        revisionNotes: [
                            "**Context:**",
                            "   - Made in 1959 but set in 1929, the film plays with the conventions of two eras: the gangster films of the Prohibition era and the gender politics of the late 1950s.",
                            "   - It directly challenged the Motion Picture Production Code (Hays Code), which was still in effect but losing its power. The film's themes of cross-dressing, homosexuality, and sexual innuendo were highly risqué. The final line, 'Well, nobody's perfect,' was a revolutionary statement of tolerance for its time.",
                            "**Film Form Analysis:**",
                            "   - **Genre:** A classic farce, relying on mistaken identity, rapid-fire dialogue, and escalating comedic situations. It also expertly parodies the 1930s gangster film genre.",
                            "   - **Performance:** The performances are key. Jack Lemmon's enthusiastic embrace of his female persona ('Daphne') provides much of the comedy, while Tony Curtis's character ('Josephine'/'Junior') parodies Cary Grant. Marilyn Monroe's iconic performance as Sugar Kane both embodies and subverts the 'dumb blonde' stereotype, adding a layer of vulnerability.",
                            "**Analysis of 3 Key Scenes:**",
                            "   - **1. The Train Journey:** The introduction of the all-female band on the train is a masterclass in comedy, as Joe and Jerry struggle to navigate this new world in high heels and dresses. It's filled with innuendo and physical comedy.",
                            "   - **2. The Yacht Seduction:** Joe, now disguised as a millionaire named 'Junior', tries to seduce Sugar by pretending to be impotent. This scene brilliantly subverts traditional romantic tropes and showcases Monroe's comedic timing and vulnerability.",
                            "   - **3. The Tango Scene:** Jerry (as Daphne) is relentlessly pursued by the millionaire Osgod. Their tango scene is a highlight of physical comedy, culminating in Osgood's proposal and Jerry's ecstatic acceptance, blurring gender and identity lines.",
                            "**Character Analysis:**",
                            "   - **Joe/Josephine/Junior (Tony Curtis):** The cynical manipulator who learns a lesson about empathy and love through his deception.",
                            "   - **Jerry/Daphne (Jack Lemmon):** The more comic and anxious of the pair, he surprisingly comes to enjoy his female identity, leading to the film's famously open-minded conclusion.",
                            "   - **Sugar Kane (Marilyn Monroe):** Represents the vulnerability and exploitation of women in the entertainment world. She is smarter than she appears and longs for genuine love.",
                            "**Specialist Study Area: Auteur & Context:**",
                            "   - Billy Wilder was a master writer-director known for his sharp, cynical wit and his ability to blend comedy with serious social commentary. His films often feature protagonists in disguise or in morally compromised situations. *Some Like It Hot* is arguably his masterpiece, a perfectly constructed comedy that also functions as a surprisingly progressive commentary on gender and identity for its time."
                        ]
                    },
                ]
            },
            {
                id: 'p1-sA-g2',
                title: 'Section A: Hollywood 1930-1990 — Group 2: New Hollywood',
                films: [
                    {
                        id: 'bonnie-clyde', title: 'Bonnie and Clyde', director: 'Arthur Penn', year: 1967, imageUrl: 'https://i.pinimg.com/1200x/7a/c7/d5/7ac7d5174b67c15ab816c885ff4f8265.jpg',
                        synopsis: 'The story of real-life Depression-era bank robbers Bonnie Parker and Clyde Barrow, whose violent crime spree captures the attention of the American public.',
                        keyFacts: { context: 'New Hollywood', 'Specialist Study': 'Auteur & Context' },
                        revisionNotes: [
                            "**Context (New Hollywood):**",
                            "   - A landmark film of the 'New Hollywood' movement. It was heavily influenced by the French New Wave, adopting its anti-establishment attitude, jarring tonal shifts, and focus on charismatic anti-heroes.",
                            "   - It reflected the counter-cultural mood of the 1960s, with its young, beautiful, and rebellious protagonists challenging a corrupt and outdated authority. Released during the Vietnam War, its graphic violence was seen as a commentary on the violence of the era.",
                            "**Film Form Analysis:**",
                            "   - **Editing:** The film breaks the rules of classical Hollywood continuity. The editing is often jarring and uses jump cuts, creating a sense of restless energy and unease, much like the French New Wave films it emulates.",
                            "   - **Sound:** The jaunty banjo score often plays in stark, ironic contrast to the violent events on screen, creating the film's signature shifts in tone from lighthearted comedy to brutal tragedy.",
                            "**Analysis of 3 Key Scenes:**",
                            "   - **1. The First Bank Robbery:** The scene is played for comedy. Clyde's attempt at a robbery is clumsy and the bank has failed, making the act pointless. This establishes them not as professional criminals, but as amateur rebels.",
                            "   - **2. The Family Reunion:** A dreamlike, slow-motion sequence where Bonnie and Clyde meet with Bonnie's mother. The golden, hazy cinematography contrasts with the rest of the film, symbolizing a longing for a normal life they can never have.",
                            "   - **3. The Final Ambush:** The groundbreaking final scene depicts the couple's brutal death in a hail of bullets, filmed in slow motion and with graphic detail. This was shocking for audiences in 1967 and forced them to confront the brutal reality of the violence they had previously been enjoying. It marked a turning point in the depiction of violence in American cinema.",
                            "**Character Analysis:**",
                            "   - **Bonnie & Clyde:** Portrayed as glamorous, sexually liberated anti-heroes. They are not just criminals; they are media-savvy celebrities who send photos and poems to the press, reflecting a modern obsession with fame.",
                            "**Specialist Study Area: Auteur & Context:**",
                            "   - Director Arthur Penn brought a European art-house sensibility to a classic American genre (the gangster film). His direction is self-conscious and stylish, a key feature of New Hollywood auteurs. The film's success shattered the last vestiges of the old Hays Code, opening the door for a new generation of filmmakers to tackle more adult and controversial themes."
                        ]
                    },
                    {
                        id: 'night-living-dead', title: 'Night of the Living Dead', director: 'George A. Romero', year: 1968, imageUrl: 'https://i.pinimg.com/736x/55/f4/c5/55f4c51409f2a7c71760f077dafce022.jpg',
                        synopsis: 'A group of strangers takes shelter in an isolated farmhouse when a mysterious plague causes the recently deceased to rise and feed on the living.',
                        keyFacts: { context: 'New Hollywood / Independent Horror', 'Specialist Study': 'Auteur & Context' },
                        revisionNotes: [
                            "**Context:**",
                            "   - A groundbreaking independent horror film made on a tiny budget outside the Hollywood system. It redefined the zombie genre, moving it from supernatural Voodoo to a more modern, quasi-scientific plague.",
                            "   - Released in 1968, a year of immense social and political turmoil in the US (Vietnam War protests, assassination of Martin Luther King Jr.). The film is widely interpreted as a political allegory for the breakdown of American society, where the real threat is not the zombies, but the inability of the living to cooperate.",
                            "**Film Form Analysis:**",
                            "   - **Cinematography:** Filmed in gritty, low-budget black and white, which gives it a documentary-like realism (cinéma vérité) and a raw, unsettling feel. This contrasts sharply with the polished look of studio horror films of the time.",
                            "   - **Sound:** The sound design is stark and effective. The use of stock music from old sci-fi films, combined with disturbing sound effects, creates a sense of dread. The constant news reports on the radio and TV add to the sense of a society collapsing in real-time.",
                            "**Analysis of 3 Key Scenes:**",
                            "   - **1. The Opening Cemetery Scene:** The film immediately establishes its shocking tone. The first zombie attack is sudden and brutal, breaking the rules of classic horror where tension is usually built slowly.",
                            "   - **2. The Trowel Scene:** A young girl, now a zombie, horrifically murders her mother with a garden trowel. This scene broke taboos by depicting a child as a monster and showing graphic violence against a family member.",
                            "   - **3. The Final Scene:** Ben, the sole survivor, is mistaken for a zombie by a white posse and shot dead. The film ends with a montage of still photos showing his body being unceremoniously thrown onto a bonfire. This bleak, ironic ending is a powerful and unforgettable political statement.",
                            "**Character Analysis:**",
                            "   - **Ben (Duane Jones):** The casting of a Black actor in the lead role was revolutionary for the time, as he was not a 'token' character but the most intelligent, resourceful, and heroic figure. His race is never mentioned, which makes his death at the hands of an all-white posse even more powerful as a metaphor for American racism.",
                            "**Specialist Study Area: Auteur & Context:**",
                            "   - George A. Romero is considered the father of the modern zombie film. His auteur vision was to use the horror genre for sharp social and political satire. His zombies are not just monsters; they are metaphors for social ills. The film's independent production context allowed him the freedom to create a film that was far more radical and pessimistic than anything the studio system would have permitted."
                        ]
                    },
                    {
                        id: 'cuckoos-nest', title: 'One Flew Over the Cuckoo\'s Nest', director: 'Miloš Forman', year: 1975, imageUrl: 'https://i.pinimg.com/736x/e4/f8/1b/e4f81b8a76568bce997333301c28f24a.jpg',
                        synopsis: 'To escape a prison sentence, petty criminal R.P. McMurphy feigns insanity and is admitted to a mental institution, where he rebels against the oppressive and tyrannical Nurse Ratched.',
                        keyFacts: { context: 'New Hollywood', 'Specialist Study': 'Auteur & Context' },
                        revisionNotes: [
                            "**Context:**",
                            "   - A key film of the New Hollywood era, reflecting the anti-authoritarian, counter-cultural spirit of the time. The mental institution is a clear metaphor for a repressive society that crushes individualism.",
                            "   - The film's source material is Ken Kesey's 1962 novel, a foundational text of the 1960s counter-culture movement.",
                            "**Film Form Analysis:**",
                            "   - **Performance:** The film is anchored by two iconic, Oscar-winning performances: Jack Nicholson's charismatic, rebellious McMurphy and Louise Fletcher's cold, calculating Nurse Ratched. Their conflict is the core of the narrative. The supporting cast, which included many first-time actors and some real mental patients, adds to the film's authenticity.",
                            "   - **Mise-en-scène:** The sterile, white, and rigidly ordered environment of the hospital ward visually represents Nurse Ratched's oppressive control.",
                            "**Analysis of 3 Key Scenes:**",
                            "   - **1. The 'World Series' Scene:** McMurphy tries to get Nurse Ratched to let the patients watch the World Series. When she refuses, he begins to 'narrate' the game as if it's on the blank TV screen. The other patients join in, a moment of collective, joyful rebellion against her authority.",
                            "   - **2. The Fishing Trip:** McMurphy hijacks a bus and takes the patients on a chaotic fishing trip. This scene represents a brief, beautiful moment of freedom and liberation from the confines of the institution.",
                            "   - **3. Billy Bibbit's Suicide & McMurphy's Attack:** After Nurse Ratched cruelly shames Billy into suicide, McMurphy finally snaps and physically attacks her. This is the tragic climax, where his rebellion becomes violent and leads directly to his lobotomy, a symbolic destruction of his spirit.",
                            "**Character Analysis:**",
                            "   - **R.P. McMurphy (Jack Nicholson):** A charismatic anti-hero and a symbol of freedom, individuality, and rebellion against conformity. He becomes a Christ-like figure who sacrifices himself to liberate others.",
                            "   - **Nurse Ratched (Louise Fletcher):** The embodiment of cold, bureaucratic, and emasculating authority. She maintains her power not through physical force, but through psychological manipulation and shame.",
                            "**Specialist Study Area: Auteur & Context:**",
                            "   - Miloš Forman was a key figure of the Czech New Wave who fled to the US. His films often focus on rebellious individuals fighting against oppressive systems, a theme rooted in his experience with authoritarian regimes. His directorial style emphasizes naturalistic performances and ensemble acting, giving the film a sense of realism despite its allegorical nature."
                        ]
                    },
                    {
                        id: 'alien', title: 'Alien', director: 'Ridley Scott', year: 1979, imageUrl: 'https://i.pinimg.com/1200x/3e/0c/0f/3e0c0fb4b6c62325be6051a2a671f092.jpg',
                        synopsis: 'The crew of the commercial spaceship Nostromo are awakened from stasis to investigate a distress signal from an alien vessel, where they encounter a deadly and terrifying life form.',
                        keyFacts: { context: 'Late New Hollywood / Sci-Fi Horror', 'Specialist Study': 'Auteur & Context' },
                        revisionNotes: [
                           "**Context:**",
                           "   - Released at the end of the New Hollywood era, *Alien* blended the auteur-driven, gritty realism of the 70s with the blockbuster potential that films like *Jaws* and *Star Wars* had pioneered.",
                           "   - The film reflects post-Vietnam era anxieties about corporate greed (the Weyland-Yutani corporation is the real villain, prioritizing profit over human life), technology, and bodily autonomy (the 'facehugger' and 'chestburster' scenes are metaphors for rape and traumatic birth).",
                           "**Film Form Analysis:**",
                           "   - **Mise-en-scène:** The production design is a key element. H.R. Giger's biomechanical design for the alien creature and the derelict ship is a terrifying fusion of the organic and the mechanical. This is contrasted with Ron Cobb's 'used future' design for the Nostromo, which looks like a worn-down industrial truck rather than a sleek spaceship.",
                           "   - **Sound:** The sound design is crucial for building suspense. The constant hum of the ship, the beeping of the motion tracker, and the creature's unearthly sounds create an atmosphere of constant dread.",
                           "**Analysis of 3 Key Scenes:**",
                           "   - **1. The 'Facehugger' Scene:** Kane discovers the alien eggs. The slow, quiet build-up of suspense as he examines the egg is shattered by the shocking violence of the facehugger leaping out. It's a masterful horror set-piece.",
                           "   - **2. The 'Chestburster' Scene:** The most famous scene in the film. What starts as a moment of relief and camaraderie around the dinner table turns into a horrific spectacle as the alien bursts from Kane's chest. The genuine shock on the other actors' faces (they were not told the full details) adds to the scene's power.",
                           "   - **3. The Final Confrontation:** Ripley, now the sole survivor, believes she is safe on the shuttle, only to discover the alien is on board with her. The scene builds tension as she slowly puts on the spacesuit before finally expelling the creature into space.",
                           "**Character Analysis:**",
                           "   - **Ellen Ripley (Sigourney Weaver):** The film famously subverted genre expectations by making Ripley the hero. She begins as a competent, by-the-book officer but transforms into a resourceful and determined survivor. She became one of cinema's most iconic female protagonists and a key figure in feminist film theory (the 'Final Girl' trope, evolved).",
                           "**Specialist Study Area: Auteur & Context:**",
                           "   - Ridley Scott began his career in advertising, and his auteur signature is his meticulous attention to visual detail, atmosphere, and world-building. While Dan O'Bannon's script was the foundation, Scott's visual genius, combined with the designs of Giger and Cobb, is what makes *Alien* a cinematic masterpiece. The film's success proved that the darker, more adult themes of New Hollywood could be combined with spectacular special effects to create a new kind of blockbuster."
                        ]
                    },
                    {
                        id: 'do-the-right-thing', title: 'Do the Right Thing', director: 'Spike Lee', year: 1989, imageUrl: 'https://i.pinimg.com/736x/00/62/af/0062af55dd773465e2ee9d59836630aa.jpg',
                        synopsis: 'On the hottest day of the year in a Bedford-Stuyvesant neighborhood, racial tensions escalate between the African American residents and the Italian American owners of a local pizzeria.',
                        keyFacts: { context: 'New Hollywood Independent Cinema', 'Specialist Study': 'Auteur & Context' },
                        revisionNotes: [
                          "**Context:**",
                          "   - **Social/Political Context:** Set against a backdrop of rising racial tensions in 1980s New York City, particularly incidents of police brutality and racially motivated violence. The film directly confronts issues of racism, gentrification, economic inequality, and police brutality.",
                          "   - **Independent Cinema Context:** A key film in the rise of Black independent cinema, proving that films centered on Black experiences could be both critically and commercially successful, operating outside the mainstream studio system.",
                          "**Film Form Analysis:**",
                          "   - **Mise-en-scène:** The Bed-Stuy street is the central character. The oppressive heat is made tangible through the vibrant, oversaturated red and orange colour scheme. Sal's 'Wall of Fame', featuring only Italian-American celebrities, is a key prop that becomes the catalyst for the final conflict.",
                          "   - **Cinematography:** Lee uses canted angles (Dutch tilts) throughout the film to create a sense of unease and escalating tension. The camera is often mobile and energetic, capturing the life of the street.",
                          "**Analysis of 3 Key Scenes:**",
                          "   - **1. The 'Racial Slur' Montage:** A sequence where characters from different ethnic groups deliver a series of racial slurs directly to the camera. This confrontational technique breaks the fourth wall, forcing the audience to confront the ugliness of prejudice directly.",
                          "   - **2. The Riot:** After Radio Raheem is killed by police, Mookie initiates the riot by throwing a trash can through the pizzeria window. This is the film's most debated moment. Is Mookie's action a destructive betrayal or a necessary channeling of the community's rage away from Sal and towards property?",
                          "   - **3. The Ending:** The film ends with two opposing quotes, one from Martin Luther King Jr. advocating non-violence, and one from Malcolm X suggesting violence in self-defense can be necessary. This ambiguous ending is a classic Lee move, refusing to provide an easy answer and forcing the audience to debate the question posed by the title.",
                          "**Character Analysis:**",
                          "   - **Mookie (Spike Lee):** The protagonist who acts as the observer and link between the different groups in the neighborhood. He is often passive, trying to stay out of the conflict, making his final act of throwing the trash can so shocking and significant.",
                          "   - **Sal (Danny Aiello):** The pizzeria owner, a complex character who is both a beloved neighborhood figure and a man with deep-seated prejudices.",
                          "   - **Radio Raheem (Bill Nunn):** A symbolic character who represents Black pride and presence. His boombox blasting 'Fight the Power' is a constant auditory challenge to the status quo. His death echoes real-life cases of police brutality.",
                          "**Specialist Study Area: Auteur & Context:**",
                          "   - Spike Lee is one of the most distinctive auteurs in American cinema. His 'signatures' are all on display: a vibrant, stylized aesthetic; direct address to the camera; a prominent musical score (Public Enemy's 'Fight the Power' is the film's anthem); and a willingness to tackle controversial political issues head-on without offering simple solutions."
                        ]
                    },
                ]
            },
            {
                id: 'p1-sB-g1',
                title: 'Section B: American film since 2012 — Group 1: Mainstream film',
                films: [
                    {
                        id: 'joker', title: 'Joker', director: 'Todd Phillips', year: 2019, imageUrl: 'https://i.pinimg.com/1200x/d8/8f/f6/d88ff626f3dbb036c89044e649d7492a.jpg',
                        synopsis: 'In 1980s Gotham, a mentally ill comedian, Arthur Fleck, spirals into nihilism after being disregarded by society, becoming a revolutionary symbol of violence.',
                        keyFacts: { context: 'Contemporary Hollywood', 'Specialist Study': 'Spectatorship & Ideology' },
                        revisionNotes: [
                           "**Context:**",
                           "   - A mainstream Hollywood film produced by Warner Bros., but with the aesthetic and tone of a gritty 1970s independent character study. It was a massive commercial success despite its dark themes and R-rating.",
                           "   - Released in a period of heightened political polarization and anxiety about social inequality, which the film taps into.",
                           "**Film Form Analysis:**",
                           "   - **Cinematography:** The film uses a bleak, desaturated colour palette and gritty on-location shooting to create a decaying, oppressive version of Gotham City. The camera often lingers on Arthur in claustrophobic close-ups.",
                           "   - **Performance:** Joaquin Phoenix's Oscar-winning performance is central. His physical transformation and portrayal of Arthur's uncontrollable laughter creates a character who is both pathetic and terrifying.",
                           "**Analysis of 3 Key Scenes:**",
                           "   - **1. The Subway Murders:** Arthur is brutally beaten by three wealthy Wayne Enterprises employees. He retaliates by shooting them, his first act of violence. The scene positions the audience to feel some sympathy for Arthur, as his violence is a reaction to relentless bullying.",
                           "   - **2. The 'Murray Franklin' Show:** Arthur, now fully transformed into Joker, appears on his idol's talk show. He delivers a nihilistic monologue before murdering Murray live on air. It is the culmination of his transformation from victim to perpetrator.",
                           "   - **3. The Staircase Dance:** After his first murder, Arthur performs a slow, strange dance down a set of stairs. This contrasts with his earlier scenes of trudging miserably up the same stairs. The dance is a visual representation of his liberation through violence.",
                           "**Character Analysis:**",
                           "   - **Arthur Fleck:** A deeply unreliable narrator. The film deliberately blurs the line between his reality and his delusions (e.g., his 'relationship' with his neighbour). This forces the audience to question everything they see.",
                           "**Specialist Study Area: Spectatorship & Ideology:**",
                           "   - **Spectatorship:** The film forces the spectator into a complex and uncomfortable position of alignment with Arthur. We see the world through his delusional perspective, which encourages empathy for a character whose actions become monstrous. This ambiguity creates a challenging spectator experience and sparked debate about whether the film justified violence.",
                           "   - **Ideology:** The film presents a strong ideological critique of a neoliberal society that cuts funding for social services and mental healthcare, leaving the vulnerable behind. It suggests that when the social contract is broken, violence is an inevitable outcome. However, its portrayal of the link between mental illness and violence is highly controversial and ideologically problematic for many critics."
                        ]
                    },
                    {
                        id: 'carol', title: 'Carol', director: 'Todd Haynes', year: 2015, imageUrl: 'https://i.pinimg.com/1200x/86/4b/af/864bafcfe675e3c2a05065127982c3b4.jpg',
                        synopsis: 'In 1950s New York, a young department-store clerk, Therese, develops an intense relationship with an older, elegant woman, Carol, who is going through a difficult divorce.',
                        keyFacts: { context: 'Contemporary Mainstream / Period Drama', 'Specialist Study': 'Spectatorship & Ideology' },
                        revisionNotes: [
                            "**Context:**",
                            "   - Set in the socially repressive 1950s, a time when homosexuality was considered a mental illness and could lead to social ostracization and loss of child custody.",
                            "**Film Form Analysis:**",
                            "   - **Cinematography:** Shot on Super 16mm film to replicate the grainy, textured look of 1950s photography. Haynes and his cinematographer frequently shoot through windows, doorways, and reflections, visually representing the characters' feelings of entrapment and the forbidden, secretive nature of their desire. This places the spectator in the position of a voyeur.",
                            "**Analysis of 3 Key Scenes:**",
                            "   - **1. The First Meeting:** Carol and Therese meet in the department store. The scene is told through glances and subtle gestures. The camera lingers on their hands and faces, conveying a powerful sense of immediate, unspoken connection.",
                            "   - **2. The Lunch Scene:** Their first meeting outside the store. The dialogue is full of subtext. The camera frames them in intimate close-ups, creating a private world for them amidst the public space of the restaurant.",
                            "   - **3. The Final Scene:** Carol and Therese reunite in a restaurant. The scene mirrors their earlier lunch, but now the power dynamic has shifted. It ends with a long, slow zoom into Therese's face as she looks at Carol, and a final, hopeful smile. The spectator is left to imagine their future.",
                            "**Character Analysis:**",
                            "   - **Carol Aird (Cate Blanchett):** Elegant and sophisticated, but trapped in a loveless marriage. She represents the courage it takes to defy social convention for the sake of personal happiness.",
                            "   - **Therese Belivet (Rooney Mara):** The film is largely from her perspective. She undergoes a transformation from a shy, uncertain young woman into a confident artist who knows what she wants.",
                            "**Specialist Study Area: Spectatorship & Ideology:**",
                            "   - **Spectatorship:** The film is a masterclass in subjective filmmaking. By aligning the spectator with Therese's longing gaze, it makes us feel the intensity of her desire for Carol. It's a film about the act of looking and being looked at.",
                            "   - **Ideology:** The film critiques the oppressive social and ideological norms of 1950s America, particularly its homophobia and sexism. Carol's husband uses a 'morality clause' against her in their divorce, a tool of a patriarchal system. By telling a lesbian love story within the beautiful, respectable visual language of a classic 1950s melodrama, the film reclaims that genre and gives a voice to a story that would have been censored and impossible to tell in the actual 1950s."
                        ]
                    },
                    {
                        id: 'la-la-land', title: 'La La Land', director: 'Damien Chazelle', year: 2016, imageUrl: 'https://i.pinimg.com/736x/f2/31/19/f23119cf8aff9e206a3b0da8803b8a3c.jpg',
                        synopsis: 'A jazz pianist and an aspiring actress fall in love while pursuing their dreams in modern-day Los Angeles, but their ambitions threaten to tear them apart.',
                        keyFacts: { context: 'Contemporary Hollywood Musical', 'Specialist Study': 'Spectatorship & Ideology' },
                        revisionNotes: [
                           "**Context:**",
                           "   - A modern film that is deeply nostalgic for the Golden Age of Hollywood musicals. It was a critical and commercial success, praised for its originality and style.",
                           "**Film Form Analysis:**",
                           "   - **Mise-en-scène & Colour:** The film uses a vibrant, saturated Technicolor-inspired colour palette. The costumes, especially Mia's brightly coloured dresses, are a key part of the visual design.",
                           "   - **Cinematography:** Features numerous long takes, especially during the musical numbers, to showcase the choreography and create a sense of spontaneous magic (e.g., the 'A Lovely Night' dance sequence).",
                           "**Analysis of 3 Key Scenes:**",
                           "   - **1. The Opening Number ('Another Day of Sun'):** The film opens with a spectacular, single-take musical number set in a Los Angeles traffic jam. It immediately establishes the film's tone, themes of ambition, and its self-conscious theatricality.",
                           "   - **2. The Planetarium Scene:** Mia and Sebastian dance among the stars in the Griffith Observatory planetarium. This is a moment of pure fantasy and romance, a tribute to classic Hollywood magic.",
                           "   - **3. The Epilogue:** A five-minute, dialogue-free fantasy sequence that imagines the life Mia and Sebastian could have had together if they had made different choices. It is a powerful, bittersweet montage that provides the film's emotional climax.",
                           "**Character Analysis:**",
                           "   - **Mia (Emma Stone) & Sebastian (Ryan Gosling):** They represent two sides of the artistic dream: she is the aspiring actress, he is the artistic purist. Their journey explores the classic conflict between love and career.",
                           "**Specialist Study Area: Spectatorship & Ideology:**",
                           "   - **Spectatorship:** The film is designed to create a powerful emotional response through its use of music, colour, and nostalgia. The ending, in particular, is designed to provoke a bittersweet, poignant feeling, offering a more complex emotional payoff than a simple happy ending.",
                           "   - **Ideology:** The film promotes an ideology of individual ambition and the 'American Dream' – the idea that you must sacrifice personal happiness and relationships to achieve professional success. The ending validates this choice, which can be read as both triumphant and tragic. It is also deeply nostalgic, which can be seen as a conservative ideology, yearning for a simpler, more glamorous past."
                        ]
                    },
                    {
                        id: 'little-women', title: 'Little Women', director: 'Greta Gerwig', year: 2019, imageUrl: 'https://i.pinimg.com/1200x/f7/ed/05/f7ed05a06429cfddd29107e7983fdece.jpg',
                        synopsis: 'Jo March reflects back and forth on her life, telling the beloved story of the March sisters – four young women each determined to live life on her own terms.',
                        keyFacts: { context: 'Contemporary Hollywood / Literary Adaptation', 'Specialist Study': 'Spectatorship & Ideology' },
                        revisionNotes: [
                           "**Context:**",
                           "   - A modern adaptation of a classic 19th-century novel, directed by a prominent female filmmaker, Greta Gerwig. It reflects contemporary feminist concerns.",
                           "**Film Form Analysis:**",
                           "   - **Narrative:** Gerwig's most significant change is the non-linear structure. The film constantly jumps between the sisters' idyllic childhood and their more difficult adulthood. This creates a powerful sense of nostalgia and melancholy. The two timelines are distinguished by their colour palettes: the past is warm and golden, while the present is colder and more desaturated.",
                           "**Analysis of 3 Key Scenes:**",
                           "   - **1. The Beach Scene (Childhood):** A beautiful, chaotic scene of the sisters playing on the beach. The handheld camera and overlapping dialogue create a feeling of warmth, freedom, and intimacy.",
                           "   - **2. Beth's Death (Adulthood):** The quiet, heartbreaking scene of Beth's death is cross-cut with an earlier, happier memory of Beth playing the piano. This editing choice intensifies the sense of loss by constantly reminding the audience of what has been lost.",
                           "   - **3. Jo Sells Her Book:** The final sequence cuts between Jo's 'fictional' romantic ending (kissing Professor Bhaer in the rain) and the 'real' ending of her negotiating with her publisher and watching her book being printed. This makes a powerful statement about female authorship.",
                           "**Character Analysis:**",
                           "   - **Jo March (Saoirse Ronan):** The ambitious, hot-tempered writer who struggles against the constraints placed on women in the 19th century. She is the film's clear focal point and a modern feminist icon.",
                           "   - **Amy March (Florence Pugh):** Gerwig's adaptation gives Amy more depth than previous versions, presenting her pragmatic view on marriage as a valid 'economic proposition' for women with no other means of financial security.",
                           "**Specialist Study Area: Spectatorship & Ideology:**",
                           "   - **Spectatorship:** The non-linear structure creates a different spectator experience. We see the joy of the past through the lens of adult loss, which makes the film more emotionally complex and poignant.",
                           "   - **Ideology:** The film has a strong feminist ideology. It emphasizes the sisters' ambitions and their struggles for economic and creative independence. The meta-narrative ending is a powerful ideological statement. It suggests that the traditional romantic ending might have been a commercial compromise forced upon the author, while the 'real' happy ending is Jo's professional success and ownership of her own work."
                        ]
                    },
                    {
                        id: 'nomadland', title: 'Nomadland', director: 'Chloé Zhao', year: 2020, imageUrl: 'https://i.pinimg.com/736x/68/e8/2d/68e82d033229a77b54123126c0c6fea2.jpg',
                        synopsis: 'Following the economic collapse of a company town in rural Nevada, Fern embarks on a journey through the American West, living as a van-dwelling modern-day nomad.',
                        keyFacts: { context: 'Contemporary Mainstream / Independent Style', 'Specialist Study': 'Spectatorship & Ideology' },
                        revisionNotes: [
                           "**Context:**",
                           "   - Based on a non-fiction book, the film explores the real-life phenomenon of older Americans, often victims of the 2008 financial crisis, who have been forced into a transient lifestyle, traveling the country for seasonal work.",
                           "**Film Form Analysis:**",
                           "   - **Cinematography:** Zhao's signature visual style is evident. She uses natural light, long takes, and vast, sweeping landscape shots, often filmed at 'magic hour' (dusk/dawn). This creates a poetic, contemplative, and almost spiritual mood.",
                           "   - **Realism:** The film blends fiction and reality. Frances McDormand (Fern) is a professional actress, but most of the other characters are real-life nomads playing fictionalized versions of themselves. This gives the film a powerful sense of authenticity.",
                           "**Analysis of 3 Key Scenes:**",
                           "   - **1. The Amazon Warehouse:** Scenes of Fern working at a massive Amazon fulfillment center highlight the precarious nature of modern gig economy work.",
                           "   - **2. The Rubber Tramp Rendezvous:** Fern joins a real-life gathering of nomads in the desert, led by Bob Wells. These scenes have a documentary feel, as people share stories and skills for survival on the road, emphasizing the theme of community.",
                           "   - **3. Fern Returns to Empire:** Fern returns to her abandoned home in the ghost town of Empire, Nevada. This is a quiet, poignant scene of her confronting her past and her grief for her late husband.",
                           "**Character Analysis:**",
                           "   - **Fern (Frances McDormand):** A fiercely independent and resilient woman who is grieving but not self-pitying. McDormand's naturalistic performance blends seamlessly with the non-professional actors.",
                           "**Specialist Study Area: Spectatorship & Ideology:**",
                           "   - **Spectatorship:** The film's docu-drama style invites a contemplative spectator response. We are positioned as quiet observers, invited to listen to the stories of the nomads and reflect on their lives without judgment.",
                           "   - **Ideology:** The film is a quiet but powerful ideological critique of a failed capitalist system that has discarded its older workers. However, it does not offer a simple political message. Instead, it finds a complex ideology of hope and resilience in the nomads' individualism and, paradoxically, their strong sense of community and connection to the American landscape."
                        ]
                    },
                ]
            },
            {
                id: 'p1-sB-g2',
                title: 'Section B: American film since 2012 — Group 2: Contemporary independent film',
                films: [
                    {
                        id: 'beasts-southern-wild', title: 'Beasts of the Southern Wild', director: 'Benh Zeitlin', year: 2012, imageUrl: 'https://i.pinimg.com/736x/20/ac/fc/20acfcad3c3d2118635b97a49efa6eff.jpg',
                        synopsis: 'Faced with her father\'s failing health and the melting ice-caps that flood her isolated bayou community, six-year-old Hushpuppy goes in search of her mother.',
                        keyFacts: { context: 'Contemporary Independent', 'Specialist Study': 'Spectatorship & Ideology' },
                        revisionNotes: [
                           "**Context:**",
                           "   - An independent film that gained huge critical acclaim. It's an allegorical response to Hurricane Katrina and its devastating impact on the marginalized communities of the Louisiana bayou.",
                           "**Film Form Analysis:**",
                           "   - **Cinematography:** The film is told entirely from the perspective of a six-year-old child, Hushpuppy. The use of a shaky, handheld camera held at a low angle creates a sense of immediacy and intimacy, immersing the spectator in Hushpuppy's raw, chaotic world.",
                           "   - **Sound:** The combination of a powerful, orchestral score and Hushpuppy's poetic voiceover narration creates a unique blend of gritty realism and mythic fantasy.",
                           "**Analysis of 3 Key Scenes:**",
                           "   - **1. The Storm:** The storm that floods 'The Bathtub' is depicted not as a natural disaster, but as a visceral, terrifying apocalypse, seen through the eyes of a child.",
                           "   - **2. The Aurochs:** Hushpuppy imagines that the melting ice caps have released prehistoric beasts called Aurochs, which are charging towards her. These creatures, created with CGI and practical effects, are a physical manifestation of her fears about the end of her world.",
                           "   - **3. The Confrontation:** At the end of the film, Hushpuppy stands up to the charging Aurochs, and they bow to her in respect. This is a moment of magical realism, symbolizing her courage and her acceptance of her place in the universe.",
                           "**Character Analysis:**",
                           "   - **Hushpuppy (Quvenzhané Wallis):** A fierce, imaginative, and resilient child protagonist. She is the heart of the film, and her perspective transforms a story of poverty and disaster into a mythic fable of survival.",
                           "**Specialist Study Area: Spectatorship & Ideology:**",
                           "   - **Spectatorship:** The film's subjective viewpoint aligns the spectator with Hushpuppy's magical realist worldview. We are forced to see the world as she does, where fantasy and reality are intertwined. This creates a powerful, emotional, and non-naturalistic viewing experience.",
                           "   - **Ideology:** The film carries a strong anti-authoritarian ideology, celebrating the resilience and fierce independence of a marginalized community living outside the system. It is also a powerful allegory for climate change, told from the perspective of a community on the front line of environmental disaster."
                        ]
                    },
                    {
                        id: 'captain-fantastic', title: 'Captain Fantastic', director: 'Matt Ross', year: 2015, imageUrl: 'https://i.pinimg.com/1200x/a0/f8/45/a0f845a920c35b4ade27566074002b35.jpg',
                        synopsis: 'In the forests of the Pacific Northwest, a father devoted to raising his six kids with a rigorous physical and intellectual education is forced to leave his paradise and enter the world, challenging his idea of what it means to be a parent.',
                        keyFacts: { context: 'Contemporary Independent', 'Specialist Study': 'Spectatorship & Ideology' },
                        revisionNotes: [
                           "**Context:**",
                           "   - An independent film that explores themes of alternative lifestyles, parenting, and the conflict between idealism and pragmatism in modern America.",
                           "**Film Form Analysis:**",
                           "   - **Mise-en-scène:** The film creates a strong visual contrast between the lush, natural wilderness where the family lives and the sterile, consumerist world of suburban America.",
                           "**Analysis of 3 Key Scenes:**",
                           "   - **1. The 'Noam Chomsky Day' Celebration:** The family celebrates their own holiday instead of Christmas, a clear rejection of mainstream consumer culture.",
                           "   - **2. The Dinner Scene:** The family visits their aunt and uncle, and the clash between the two families' values is played for both comedy and drama. The children's blunt honesty and advanced knowledge embarrasses their cousins.",
                           "   - **3. The Funeral:** Ben and the children disrupt the formal Christian funeral of their mother, carrying out her wishes for a Buddhist cremation instead. This is their ultimate act of rebellion against the 'system'.",
                           "**Character Analysis:**",
                           "   - **Ben Cash (Viggo Mortensen):** A charismatic but flawed idealist. He is a loving father who has given his children an incredible education, but his rigid ideology has also left them socially inept and unprepared for the real world.",
                           "**Specialist Study Area: Spectatorship & Ideology:**",
                           "   - **Spectatorship:** The film positions the spectator to question their own values. Initially, we are aligned with Ben's idealistic, anti-capitalist family. However, as the film progresses and we see the negative consequences of their isolation, our alignment shifts, leading to a complex and conflicted response.",
                           "   - **Ideology:** The film explores the conflict between competing ideologies: the anti-capitalist, self-sufficient idealism of Ben versus the mainstream, consumerist values of modern America. It does not offer a simple answer. It critiques the emptiness of consumer culture but also shows the importance of social integration. The ending is a compromise, suggesting a balance between these two ideological poles is needed."
                        ]
                    },
                    {
                        id: 'moonlight', title: 'Moonlight', director: 'Barry Jenkins', year: 2016, imageUrl: 'https://i.pinimg.com/736x/2c/21/fc/2c21fccf70f6cbaa41faddf5f093e8b8.jpg',
                        synopsis: 'A chronicle of the childhood, adolescence, and burgeoning adulthood of a young, African-American, gay man growing up in a rough neighborhood of Miami.',
                        keyFacts: { context: 'Contemporary Independent', 'Specialist Study': 'Spectatorship & Ideology' },
                        revisionNotes: [
                           "**Context:**",
                           "   - A low-budget independent film that famously won the Academy Award for Best Picture. It was a landmark film for its representation of Black masculinity and homosexuality.",
                           "**Film Form Analysis:**",
                           "   - **Cinematography:** Director Barry Jenkins and his cinematographer James Laxton use a highly sensuous and poetic visual style. The colours are rich and saturated, and the use of shallow focus and handheld camera creates a feeling of intimacy and immediacy.",
                           "   - **Structure:** The film's three-part structure ('Little', 'Chiron', 'Black'), with different actors playing the protagonist at different ages, is crucial. It emphasizes the theme of identity and how it is both constant and changing over time.",
                           "**Analysis of 3 Key Scenes:**",
                           "   - **1. The 'Swimming' Scene:** The drug dealer Juan, a surrogate father figure, teaches the young Chiron (Little) how to swim. It's a tender and beautiful scene of male intimacy and vulnerability, shot with a fluid, immersive camera.",
                           "   - **2. The 'Beach' Scene:** The teenage Chiron has his first sexual experience with his friend Kevin on a moonlit beach. The scene is handled with incredible sensitivity and beauty.",
                           "   - **3. The 'Diner' Scene:** Years later, the adult Chiron, now a hardened drug dealer himself, reunites with Kevin in a diner. The awkward, hesitant conversation is filled with unspoken longing. The scene's power comes from its quietness and the performances.",
                           "**Character Analysis:**",
                           "   - **Chiron:** A quiet, sensitive, and introverted character who struggles to find his place in a world that demands a tough, hyper-masculine exterior. The three actors who play him all capture his essential vulnerability.",
                           "**Specialist Study Area: Spectatorship & Ideology:**",
                           "   - **Spectatorship:** The film creates a deeply intimate and empathetic spectator experience. By focusing on Chiron's internal, emotional world, it aligns the spectator with a character who is often silent and withdrawn.",
                           "   - **Ideology:** The film is ideologically radical in its quietness. It subverts the dominant, often violent and stereotypical, media representations of Black men. It presents a nuanced and tender portrait of Black masculinity and queer identity, arguing that vulnerability and connection are forms of strength. It is a powerful example of intersectionality (bell hooks), exploring how race, class, and sexuality combine to shape a life."
                        ]
                    },
                    {
                        id: 'get-out', title: 'Get Out', director: 'Jordan Peele', year: 2017, imageUrl: 'https://i.pinimg.com/736x/12/ad/82/12ad8202f3e0a9095a4c9faddeadd67b.jpg',
                        synopsis: 'A young African-American man visits his white girlfriend\'s parents for a weekend getaway, where his simmering unease about their reception of him eventually reaches a boiling point.',
                        keyFacts: { context: 'Contemporary Independent / Horror', 'Specialist Study': 'Spectatorship & Ideology' },
                        revisionNotes: [
                            "**Context:**",
                            "   - An independent horror film from Blumhouse Productions that became a massive cultural and commercial phenomenon. It was released shortly after the election of Donald Trump and tapped into renewed anxieties about race relations in America.",
                            "**Film Form Analysis:**",
                            "   - **Genre Hybridity:** The film masterfully blends horror, comedy, and social satire. The horror builds suspense and provides visceral thrills, while the comedy (mostly from Chris's friend Rod) provides moments of relief and social commentary (Steve Neale's theory of repetition and difference).",
                            "**Analysis of 3 Key Scenes:**",
                           "   - **1. The 'Sunken Place':** After being hypnotized by Missy, Chris finds himself paralyzed and falling into a dark void, able to see the world but unable to control his own body. This is a brilliant and terrifying visual metaphor for the experience of systemic racism and the feeling of powerlessness.",
                           "   - **2. The 'Party' Scene:** At the garden party, Chris is subjected to a series of awkward and racially charged comments (microaggressions) from the white guests. The scene builds a powerful sense of paranoia and alienation, aligning the audience with Chris's growing unease.",
                           "   - **3. The 'Revelation' Scene:** The film's big twist is revealed: the Armitage family transplants the brains of wealthy white people into the bodies of Black people they have captured. This literalizes the idea of the white appropriation and consumption of Black culture and bodies.",
                            "**Character Analysis:**",
                           "   - **Chris Washington (Daniel Kaluuya):** The audience's surrogate. He is a talented photographer, and his camera lens is often used as a way of framing the film's events, symbolizing his role as an observer trying to make sense of the strange world he has entered.",
                            "**Specialist Study Area: Spectatorship & Ideology:**",
                            "   - **Spectatorship:** Peele uses horror conventions to align the spectator with the protagonist Chris's experience of racism. The audience shares his paranoia and dread. The original ending was much bleaker (Chris is arrested by the police), but Peele changed it to provide a more cathartic release for the audience.",
                            "   - **Ideology:** The film's primary ideological function is to expose a specific kind of 'post-racial' liberal racism. The villains are not overt white supremacists; they are wealthy, educated liberals who fetishize Black physicality and culture. It's a powerful critique of a society that claims to be past racism while still perpetuating it in more insidious forms."
                        ]
                    },
                     {
                        id: 'promising-young-woman', title: 'Promising Young Woman', director: 'Emerald Fennell', year: 2020, imageUrl: 'https://i.pinimg.com/1200x/49/59/91/495991c720f3635a50025c0e3a6997fa.jpg',
                        synopsis: 'A young woman, traumatized by a past event, seeks to avenge the death of her best friend by confronting the "nice guys" who try to take advantage of her.',
                        keyFacts: { context: 'Contemporary Independent Cinema', 'Specialist Study': 'Spectatorship & Ideology' },
                        revisionNotes: [
                          "**Context:**",
                          "   - A key 'post-#MeToo' film that directly engages with contemporary debates about rape culture, consent, and accountability.",
                          "**Film Form Analysis:**",
                          "   - **Mise-en-scène & Sound:** The film's aesthetic is deliberately jarring. It uses a bright, pastel colour palette, pop music (like Britney Spears' 'Toxic'), and the visual codes of a romantic comedy. This creates a stark tonal dissonance with the film's dark subject matter, visually representing the film's theme of a toxic reality hiding beneath a sweet-looking surface.",
                          "**Analysis of 3 Key Scenes:**",
                          "   - **1. The Opening Scene:** Cassie pretends to be drunk at a bar, and a 'nice guy' takes her home, intending to take advantage of her. She then reveals her sobriety, terrifying him. This scene immediately establishes the film's premise and subverts audience expectations.",
                          "   - **2. The 'Paris Hilton' Scene:** Cassie and her love interest, Ryan, dance in a pharmacy to Paris Hilton's 'Stars Are Blind'. It's a perfect recreation of a romantic comedy scene, which makes the later revelation of Ryan's own complicity all the more devastating.",
                          "   - **3. The Ending:** Cassie is murdered at the bachelor party, but she has a contingency plan in place. The final sequence, where Ryan's wedding is interrupted by the police arriving to arrest the groom, is shocking, bleak, and deeply divisive.",
                          "**Character Analysis:**",
                          "   - **Cassie Thomas (Carey Mulligan):** A complex and morally ambiguous protagonist. She is a vigilante driven by grief and rage. Her dual identity (sweet cafe worker by day, avenger by night) is reflected in her costume and performance.",
                          "**Specialist Study Area: Spectatorship & Ideology:**",
                          "   - **Spectatorship:** The film constantly plays with and subverts spectator expectations. By packaging a revenge thriller in the aesthetics of a rom-com, it creates an unsettling experience. The shocking ending denies the audience a simple or satisfying resolution, forcing them to confront difficult questions about justice and revenge.",
                          "   - **Ideology:** The film offers a searing feminist critique of rape culture and the patriarchal systems that protect predators. It argues that complicity is as bad as the act itself and challenges the cultural myth of the 'nice guy' who is just 'making a mistake'."
                        ]
                    },
                ]
            },
            {
                id: 'p1-sC',
                title: 'Section C: British film since 1995',
                films: [
                    {
                        id: 'trainspotting', title: 'Trainspotting', director: 'Danny Boyle', year: 1996, imageUrl: 'https://i.pinimg.com/1200x/1a/95/23/1a95235c323c4ff764152fe337898951.jpg',
                        synopsis: 'A wild trip through the Edinburgh drug scene, focusing on Mark Renton and his attempt to give up his heroin habit and escape his chaotic friends.',
                        keyFacts: { context: 'British Independent Cinema ("Cool Britannia")', 'Specialist Study': 'Narrative & Ideology' },
                        revisionNotes: [
                            "**Context:**",
                            "   - A key film in the 'Cool Britannia' cultural movement of the mid-90s, which celebrated a new, modern, and vibrant British identity.",
                            "   - It was a controversial but hugely successful independent film that captured the zeitgeist of a generation.",
                            "**Film Form Analysis:**",
                            "   - **Editing & Cinematography:** The film has a hyper-kinetic, stylized aesthetic with freeze frames, jump cuts, surreal fantasy sequences (like the 'worst toilet in Scotland' scene), and a fast-paced editing style that mimics the energy of the Britpop music on its famous soundtrack.",
                            "**Analysis of 3 Key Scenes:**",
                            "   - **1. The 'Choose Life' Opening:** The film opens with Renton running from the police as his famous 'Choose Life' monologue plays in voiceover. This immediately establishes the film's rebellious, anti-consumerist tone and energetic style.",
                            "   - **2. The 'Baby' Scene:** The horrific surreal sequence where the dead baby crawls on the ceiling during Renton's withdrawal is a terrifying depiction of the psychological horrors of addiction.",
                            "   - **3. The Final Scene:** Renton betrays his friends, steals the money, and walks away towards a new life. His revised 'Choose Life' monologue suggests a reluctant acceptance of the very consumerist life he once rejected. It's an ambiguous and cynical ending.",
                            "**Character Analysis:**",
                            "   - **Mark Renton (Ewan McGregor):** A cynical, witty, and deeply flawed anti-hero. His voiceover narration gives the audience direct access to his worldview.",
                            "**Specialist Study Area: Narrative & Ideology:**",
                            "   - **Narrative:** The narrative is episodic and non-linear, reflecting the chaotic lives of the characters. It rejects a clear Todorovian structure. Renton's direct-address voiceover is the key narrative device, creating a subjective and unreliable perspective.",
                            "   - **Ideology:** The film is a powerful ideological statement about the generation of working-class youth left behind by the economic policies of Thatcher's Britain in the 1980s. The 'Choose Life' monologue is a rejection of consumer culture and the 'normal' life from which the characters feel excluded. It also presents a gritty, modern, and subversive version of Scottish identity."
                        ]
                    },
                     {
                        id: 'shaun-of-the-dead', title: 'Shaun of the Dead', director: 'Edgar Wright', year: 2004, imageUrl: 'https://i.pinimg.com/1200x/77/6f/6a/776f6a8381d34ca9df541e72e5592dae.jpg',
                        synopsis: 'A man decides to turn his moribund life around by winning back his ex-girlfriend, reconciling with his mother, and dealing with an entire community that has suddenly returned from the dead to eat the living.',
                        keyFacts: { context: 'British Comedy/Horror', 'Specialist Study': 'Narrative & Ideology' },
                        revisionNotes: [
                            "**Context:**",
                            "   - A British film that achieved international success, helping to popularize the 'zom-com' (zombie-comedy) hybrid genre.",
                            "**Film Form Analysis:**",
                            "   - **Editing:** Features Edgar Wright's signature fast-paced, kinetic editing style, with whip pans, crash zooms, and montage sequences synchronized to music.",
                            "**Analysis of 3 Key Scenes:**",
                            "   - **1. The 'Don't Stop Me Now' Scene:** The characters fight off a zombie in the pub using pool cues, perfectly synchronized to the Queen song on the jukebox. It's a brilliant example of comedy, action, and sound design working together.",
                            "   - **2. The 'Convenience Store' Scene:** Shaun walks to the store and back, completely oblivious to the signs of the zombie apocalypse happening around him. This scene uses repetition (mirroring the same walk from the beginning of the film) to create humour and show his self-absorbed state.",
                            "**Specialist Study Area: Narrative & Ideology:**",
                            "   - **Narrative & Genre:** The film is a pastiche of and homage to George A. Romero's zombie films. It follows the narrative conventions of a zombie apocalypse story but subverts them with a very British sense of humour and a focus on mundane, everyday life. The narrative is also a romantic comedy, as Shaun's main goal is to win back his girlfriend, Liz.",
                            "   - **Ideology:** The film functions as a social satire. The zombies are a metaphor for the mindless, droning nature of modern life, consumerism, and routine. Before the apocalypse, the people in Shaun's life (checkout workers, commuters) are already acting like zombies. The film satirizes British stoicism and the tendency to 'keep calm and carry on' even in a crisis."
                        ]
                    },
                    {
                        id: 'this-is-england', title: 'This Is England', director: 'Shane Meadows', year: 2006, imageUrl: 'https://i.pinimg.com/1200x/88/0b/41/880b410eaebeaf927c5de2ad279c2b7f.jpg',
                        synopsis: 'A lonely young boy, Shaun, finds camaraderie with a group of skinheads in 1983 England. His newfound happiness is shattered when a racist ex-convict, Combo, returns and divides the group with his nationalist ideology.',
                        keyFacts: { context: 'British Social Realism', 'Specialist Study': 'Narrative & Ideology' },
                        revisionNotes: [
                           "**Context:**",
                           "   - Set in 1983, against the backdrop of the Falklands War, Thatcherism, and high unemployment. It explores the social conditions that led to the rise of far-right nationalism in working-class communities.",
                           "**Film Form Analysis:**",
                           "   - **Aesthetic:** Uses the conventions of British social realism: on-location shooting, naturalistic lighting, improvised dialogue, and a focus on the lives of ordinary, working-class people.",
                           "**Analysis of 3 Key Scenes:**",
                           "   - **1. The Opening Montage:** A montage of news footage from 1983 (Falklands War, Margaret Thatcher, pop culture) quickly establishes the film's social and historical context.",
                           "   - **2. Combo's Speech:** Combo delivers a charismatic but hateful nationalist speech, successfully persuading some of the group to join his racist cause. The scene shows how easily vulnerable young men can be radicalized.",
                           "   - **3. Milky's Beating:** The film's horrific climax, where Combo brutally beats the kind-hearted Jamaican member of the group, Milky. The scene is shot in a single, unflinching take, forcing the audience to witness the shocking violence.",
                           "**Specialist Study Area: Narrative & Ideology:**",
                           "   - **Narrative:** A linear, 'coming-of-age' story that takes a very dark turn. The narrative follows Shaun's loss of innocence as he is drawn into a world of violence and racism.",
                           "   - **Ideology:** The film is a powerful critique of racism and nationalism. It argues that the skinhead subculture, originally rooted in Jamaican music and style, was co-opted and corrupted by racist ideology. It shows how personal pain and social disenfranchisement can be twisted into hatred. The final shot of Shaun throwing the English flag into the sea is a symbolic rejection of Combo's toxic nationalism."
                        ]
                    },
                    {
                        id: 'fish-tank', title: 'Fish Tank', director: 'Andrea Arnold', year: 2009, imageUrl: 'https://i.pinimg.com/1200x/3a/3f/be/3a3fbeeb1792cacb913cc5f90e899855.jpg',
                        synopsis: 'A volatile, socially isolated 15-year-old girl, Mia, finds her life thrown into turmoil when her mother brings home a charismatic new boyfriend, Connor.',
                        keyFacts: { context: 'British Social Realism', 'Specialist Study': 'Narrative & Ideology' },
                        revisionNotes: [
                            "**Context:**",
                            "   - A critically acclaimed film from the British social realist tradition, focusing on life on a council estate in Essex.",
                            "**Film Form Analysis:**",
                            "   - **Cinematography:** Shot in a 4:3 aspect ratio (like an old TV screen), which creates a claustrophobic, boxed-in feeling, mirroring Mia's sense of being trapped. The camera is almost entirely handheld and follows Mia closely from behind, creating a subjective and intimate perspective.",
                            "**Analysis of 3 Key Scenes:**",
                            "   - **1. Mia Dances:** Mia practices her hip-hop dancing alone in an empty flat. These scenes represent her dreams of escape and her only form of self-expression.",
                            "   - **2. The Scene with Connor:** The inappropriate relationship between Mia and her mother's boyfriend, Connor, builds with a mixture of charm and menace, culminating in a deeply uncomfortable sexual encounter.",
                            "**Specialist Study Area: Narrative & Ideology:**",
                            "   - **Narrative:** A linear social realist narrative that follows Mia's perspective. It avoids melodrama, instead focusing on small, observational details of her life. The narrative is deliberately open-ended, offering a glimmer of hope at the end but no easy resolution.",
                            "   - **Ideology:** The film explores themes of class, adolescence, and female sexuality from a female perspective (the 'female gaze'). It offers a raw and unsentimental critique of the lack of opportunities and social mobility for young people in deprived areas. It challenges stereotypes by presenting Mia as a complex, sympathetic character, not just a 'chav'."
                        ]
                    },
                    {
                        id: 'we-need-to-talk-about-kevin', title: 'We Need to Talk About Kevin', director: 'Lynne Ramsay', year: 2011, imageUrl: 'https://i.pinimg.com/1200x/07/2e/07/072e07bc007d33fb807a39755ab87e48.jpg',
                        synopsis: 'A mother contends with the increasing malevolence of her son, trying to love him in the face of his violent acts which culminate in a high-school massacre.',
                        keyFacts: { context: 'British Independent / Art House', 'Specialist Study': 'Narrative & Ideology' },
                        revisionNotes: [
                          "**Context:**",
                          "   - An art-house psychological thriller that deals with the aftermath of a fictional school shooting, a highly sensitive and relevant topic in contemporary society.",
                          "**Film Form Analysis:**",
                          "   - **Sound & Colour:** The film uses a highly stylized and subjective aesthetic. The colour red is a recurring visual motif, symbolizing blood, guilt, and danger (e.g., the paint thrown on Eva's house, the jam sandwiches). The sound design is disorienting, blending diegetic and non-diegetic sounds to reflect Eva's fragmented mental state.",
                          "**Analysis of 3 Key Scenes:**",
                          "   - **1. La Tomatina Festival:** The film opens with Eva at the Spanish tomato festival, being submerged in a sea of red. This surreal, dreamlike image functions as a visual metaphor for the blood and guilt that will engulf her life.",
                          "   - **2. The 'Archery' Scene:** We see Kevin practicing archery in the garden. This is intercut with shots of the aftermath of the massacre, creating a sickening sense of foreshadowing.",
                          "**Specialist Study Area: Narrative & Ideology:**",
                          "   - **Narrative:** The narrative is highly fragmented and non-linear, structured around the mother Eva's traumatic memories. It constantly jumps back and forth in time, forcing the audience to piece together the events. This psychological structure mirrors Eva's shattered psyche.",
                          "   - **Ideology:** The film challenges the dominant ideology of motherhood. It portrays motherhood not as natural and fulfilling, but as a source of anxiety, resentment, and guilt, exploring the taboo subject of a mother who does not love her own child. It raises disturbing ideological questions about the 'nature vs. nurture' debate: Was Kevin born evil, or was he a product of Eva's ambivalent parenting? The film refuses to provide a simple answer."
                        ]
                    },
                     {
                        id: 'under-the-skin', title: 'Under the Skin', director: 'Jonathan Glazer', year: 2013, imageUrl: 'https://i.pinimg.com/736x/4d/8b/ac/4d8bace42e3e999b76b619a1627b0e52.jpg',
                        synopsis: 'A mysterious alien entity, disguised as a beautiful woman, scours the streets of Scotland, seducing and preying on lonely men.',
                        keyFacts: { context: 'British Art House / Sci-Fi', 'Specialist Study': 'Narrative & Ideology' },
                        revisionNotes: [
                          "**Context:**",
                          "   - A highly experimental art-house film. Many of the scenes of the alien interacting with men were filmed with hidden cameras, using non-professional actors who did not know they were in a film.",
                          "**Film Form Analysis:**",
                          "   - **Cinematography & Sound:** The film uses two distinct visual styles: a gritty, social realist style for the scenes on the street, and a surreal, abstract style for the black 'void' where the alien takes her victims. The sound design is alien and unsettling.",
                          "**Specialist Study Area: Narrative & Ideology:**",
                          "   - **Narrative:** The narrative is minimalist and elliptical. It is told almost entirely from the alien's perspective, but without giving us access to her thoughts. We observe her observing humanity, and gradually see her begin to develop a form of empathy. It's a narrative of an outsider trying to understand what it means to be human.",
                          "   - **Ideology & The 'Female Gaze':** The film can be read as a reversal of the 'male gaze'. The protagonist is a female predator who objectifies and consumes men. It uses this sci-fi premise to explore themes of gender, sexuality, and what it means to be human from a detached, alien perspective."
                        ]
                    },
                    {
                        id: 'belfast', title: 'Belfast', director: 'Kenneth Branagh', year: 2021, imageUrl: 'https://i.pinimg.com/736x/b6/39/59/b63959cc6bff5e98c10e6450a69319d7.jpg',
                        synopsis: 'A semi-autobiographical film which chronicles the life of a working-class family and their young son\'s childhood during the tumult of the late 1960s in the Northern Ireland capital.',
                        keyFacts: { context: 'British Historical Drama', 'Specialist Study': 'Narrative & Ideology' },
                        revisionNotes: [
                          "**Context:**",
                          "   - Set in 1969 at the beginning of 'The Troubles' in Northern Ireland, a period of intense political and sectarian conflict.",
                          "**Film Form Analysis:**",
                          "   - **Cinematography:** The film is shot almost entirely in black and white, which creates a nostalgic, memory-like quality. However, the films and plays the family watch are shown in vibrant colour, suggesting that art and cinema are a colourful escape from the bleak reality of the conflict.",
                          "**Specialist Study Area: Narrative & Ideology:**",
                          "   - **Narrative:** The story is told from the perspective of the nine-year-old protagonist, Buddy. This child's-eye-view narrative filters the complex political conflict through the lens of family life, school crushes, and a love of movies. The political violence is often seen but not fully understood by Buddy.",
                          "   - **Ideology:** The film has a strong humanist ideology. It focuses on the impact of conflict on an ordinary family, emphasizing community, love, and the tragedy of being forced to leave one's home. It is not a political film about the causes of The Troubles, but a personal film about the experience of living through them. It has a nostalgic and sentimental tone."
                        ]
                    },
                ]
            }
        ]
    },
    {
        id: 'paper-2',
        title: 'Component 2: Global filmmaking perspectives',
        categories: [
             {
                id: 'p2-sA-g1',
                title: 'Section A: Global film — Group 1: European film',
                films: [
                   {
                        id: 'life-is-beautiful', title: 'Life Is Beautiful', director: 'Roberto Benigni', year: 1997, imageUrl: 'https://i.pinimg.com/736x/08/73/e7/0873e7a415fbe03a17327a24398c1c71.jpg',
                        synopsis: 'A Jewish-Italian waiter, Guido, must use his imagination to shield his young son from the horrors of a Nazi concentration camp by pretending their internment is an elaborate game.',
                        keyFacts: { context: 'Italian Cinema / Holocaust Drama', 'Specialist Study': 'Core Study Areas' },
                        revisionNotes: [
                            "**Context:**",
                            "   - An Italian film that achieved massive international success. It was highly controversial for its use of comedy in the context of the Holocaust, a subject usually treated with solemnity.",
                            "**Film Form:**",
                            "   - **Narrative & Tone:** The film is famously split into two distinct halves. The first half is a lighthearted, slapstick romantic comedy. The second half takes place in a concentration camp, but Guido tries to maintain the comedic tone for his son. This jarring tonal shift is the film's most defining and debated feature.",
                            "**Meaning & Response:**",
                            "   - The film is a fable about the power of imagination and hope to resist even the most horrific circumstances. Guido's 'game' is an act of profound love and psychological resistance. The debate among critics and audiences centres on whether this comedic approach trivializes the reality of the Holocaust or offers a powerful and unique perspective on human resilience."
                        ]
                    },
                    {
                        id: 'pans-labyrinth', title: 'Pan\'s Labyrinth', director: 'Guillermo del Toro', year: 2006, imageUrl: 'https://i.pinimg.com/1200x/bd/2d/21/bd2d219d2d107b7c1c1103083b87e9d7.jpg',
                        synopsis: 'In the falangist Spain of 1944, the bookish young stepdaughter of a sadistic army officer escapes into an eerie but captivating fantasy world.',
                        keyFacts: { context: 'Spanish/Mexican Co-production / Dark Fantasy', 'Specialist Study': 'Core Study Areas' },
                        revisionNotes: [
                           "**Context:**",
                           "   - Set in 1944, five years after the end of the Spanish Civil War. The film is a powerful allegory for the brutality of Franco's fascist regime.",
                           "**Film Form:**",
                           "   - **Narrative:** The film weaves together two parallel stories: the brutal reality of the post-war conflict and the magical, but equally dangerous, fantasy world that Ofelia discovers. The question of whether the fantasy world is 'real' or a product of Ofelia's imagination is left open.",
                           "   - **Mise-en-scène & Colour:** Del Toro uses a distinct colour palette to differentiate the two worlds. The real world is cold, blue, and grey, while the fantasy world is rich in golden and crimson tones. The creature design (the Faun, the Pale Man) is grotesque and unforgettable.",
                           "**Meaning & Response:**",
                           "   - The film argues that disobedience and imagination are acts of rebellion against tyranny. Ofelia's final choice – to sacrifice herself rather than harm an innocent – is a moral victory. The fantasy world is not an escape from reality, but a way of understanding and navigating its horrors."
                        ]
                    },
                   {
                        id: 'mustang', title: 'Mustang', director: 'Deniz Gamze Ergüven', year: 2015, imageUrl: 'https://i.pinimg.com/1200x/cf/b6/a4/cfb6a4e2930e03d61f613a5fb67f8b5b.jpg',
                        synopsis: 'In a remote Turkish village, five orphaned sisters are placed under house arrest and forced into arranged marriages after being seen playing innocently with boys on a beach.',
                        keyFacts: { context: 'Turkish/French Co-production / Art House', 'Specialist Study': 'Core Study Areas' },
                        revisionNotes: [
                            "**Context:**",
                            "   - A co-production between France, Turkey, and Germany, reflecting the globalized nature of modern film production. It addresses the clash between conservative, patriarchal tradition and modern, liberal values within contemporary Turkey. The director is a Turkish woman educated in France, giving her an insider/outsider perspective.",
                            "**Film Form Analysis:**",
                            "   - **Cinematography:** The film is shot in a naturalistic style with warm, sun-drenched lighting that initially gives it a dreamlike, idyllic quality. This creates a stark contrast with the increasingly oppressive and prison-like reality the girls face as their freedom is stripped away. The frequent use of handheld camera creates a sense of intimacy and immediacy.",
                            "   - **Mise-en-scène:** The house is the primary setting and transforms from a home into a prison. The girls' colourful, modern clothes are replaced with 'shit-coloured' traditional dresses. Bars are literally placed on the windows. The sisters' long, flowing hair, a symbol of freedom and femininity, is a central visual motif.",
                            "**Analysis of 3 Key Scenes:**",
                            "   - **1. The Opening Beach Scene:** The sisters play innocently in the sea with some boys. This scene, full of joy and freedom, is what triggers their confinement, establishing the central conflict between youthful innocence and the repressive patriarchal society.",
                            "   - **2. The Football Match Escape:** The sisters sneak out of the house to attend a football match. This is a key moment of rebellion and solidarity, shot with an energetic, handheld camera that captures their exhilaration.",
                            "   - **3. Lale's Escape:** The youngest sister, Lale, finally escapes the 'wife factory' and makes a break for freedom in Istanbul. The final shot of her embracing her teacher represents a hopeful, though uncertain, future.",
                            "**Character Analysis:**",
                            "   - **The Sisters:** While they function as a collective, each sister represents a different response to their oppression. The youngest, Lale, is the defiant narrator and the ultimate symbol of rebellion.",
                            "**Meaning & Response:**",
                            "   - The film functions as a powerful feminist allegory or modern fairytale. The sisters' rebellion against their confinement is a universal story about the struggle for freedom against oppressive patriarchal control. The title *Mustang* compares the girls to untamed wild horses, a symbol of their defiant, untameable spirit."
                        ]
                    },
                    {
                        id: 'portrait-of-a-lady-on-fire', title: 'Portrait of a Lady on Fire', director: 'Céline Sciamma', year: 2019, imageUrl: 'https://i.pinimg.com/736x/31/d1/d9/31d1d97525ee5933c4cbe59ef704a081.jpg',
                        synopsis: 'On an isolated island in Brittany at the end of the 18th century, a female painter is obliged to paint a wedding portrait of a young woman in secret.',
                        keyFacts: { context: 'French Cinema / Historical Romance', 'Specialist Study': 'Core Study Areas' },
                        revisionNotes: [
                            "**Context:**",
                            "   - A French historical romance directed by a prominent female queer filmmaker, Céline Sciamma. The film is a deliberate attempt to create a love story centered on the 'female gaze', reversing the traditional power dynamics of artist and subject.",
                            "**Film Form:**",
                            "   - **Cinematography:** The film is composed of beautifully framed, painterly shots, referencing the art of the period. The camera's gaze is collaborative, not objectifying. The act of looking is mutual between the two women.",
                            "   - **Sound:** There is almost no non-diegetic musical score for most of the film. This creates a very intimate and naturalistic atmosphere. The few moments where music does appear (the bonfire scene, the final concert) are therefore incredibly powerful and emotionally resonant.",
                            "**Meaning & Response:**",
                            "   - The film is a profound meditation on art, memory, and love. It explores how the act of creating art is an act of love and remembrance. The myth of Orpheus and Eurydice is a recurring motif, reframed from a female perspective: Eurydice is not a passive victim, but an active participant in the final look. The film suggests it is the choice of the poet, not the lover."
                        ]
                    },
                ]
            },
            {
                id: 'p2-sA-g2',
                title: 'Section A: Global film — Group 2: Outside Europe',
                films: [
                    {
                        id: 'city-of-god', title: 'City of God (Cidade de Deus)', director: 'Fernando Meirelles & Kátia Lund', year: 2002, imageUrl: 'https://i.pinimg.com/736x/55/5b/c7/555bc767a52d17c8fa6ba9ece1658c7b.jpg',
                        synopsis: 'A saga of two boys growing up in the violent favelas of Rio de Janeiro: one becomes a photographer who documents the rising drug-related violence, while the other becomes a ruthless gang leader.',
                        keyFacts: { context: 'Brazilian Cinema', 'Specialist Study': 'Core Study Areas' },
                        revisionNotes: [
                            "**Context:**",
                            "   - The film shone an international spotlight on the poverty, crime, and social inequality within the favelas of Rio de Janeiro. It was praised for its authenticity, using many non-professional actors from the favelas themselves, which adds to its social realist credentials.",
                            "**Film Form Analysis:**",
                            "   - **Editing & Cinematography:** The film is famous for its kinetic, fast-paced 'MTV style' editing and dynamic, handheld camerawork. This style immerses the viewer in the chaotic and dangerous energy of the favelas. The use of jump cuts, freeze frames, and whip pans creates a visceral and breathless experience that was highly influential.",
                            "   - **Narrative:** The narrative is complex and epic in scope, spanning several decades ('The Story of the Tender Trio', 'The Story of Li'l Zé'). It uses a non-linear structure with flashbacks and multiple character perspectives, all held together by the voiceover narration of the protagonist, Rocket.",
                            "**Analysis of 3 Key Scenes:**",
                            "   - **1. The Opening Scene:** A chicken escapes during a barbecue, leading to a chaotic chase through the favela that culminates in a standoff between Rocket, the gangs, and the police. The film then famously flashes back in time. This opening perfectly establishes the film's energetic style and central conflicts.",
                            "   - **2. The 'Apartment' Scene:** The drug-addled 'Tender Trio' botch a robbery, leading to a massacre. This is the moment Li'l Zé, then just a small child, commits his first murder, establishing his psychopathic nature.",
                            "   - **3. Rocket's Photography:** Rocket gets a camera and starts taking pictures. The scene where his photos of the gang are published in the newspaper is a key turning point. His camera, a tool of art and observation, becomes his way out of the cycle of violence.",
                            "**Character Analysis:**",
                            "   - **Rocket:** The narrator and the audience's guide through the world of the favela. He is an observer, not a participant in the violence, and his camera represents the possibility of escape through art.",
                            "   - **Li'l Zé:** The antagonist, a ruthless and power-hungry sociopath. He represents the destructive side of the favela, where violence is the only way to gain power.",
                            "**Meaning & Response:**",
                            "   - The film neither glamorizes nor simply condemns the violence it depicts. Instead, it presents it as a complex and inescapable cycle of poverty and revenge. The camera acts as Rocket's tool of observation, allowing the audience to bear witness to this world without offering easy moral judgments. The film's response is one of social commentary rather than moral prescription."
                        ]
                    },
                     {
                        id: 'parasite', title: 'Parasite', director: 'Bong Joon-ho', year: 2019, imageUrl: 'https://i.pinimg.com/1200x/53/97/c6/5397c63f93aecc18123b2a6ea2c1ed8f.jpg',
                        synopsis: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
                        keyFacts: { context: 'South Korean Cinema', 'Specialist Study': 'Core Study Areas' },
                        revisionNotes: [
                           "**Context:**",
                           "   - A South Korean film that became a global phenomenon, famously winning the Academy Award for Best Picture. It is a sharp social satire about class inequality in modern South Korea.",
                           "**Film Form:**",
                           "   - **Mise-en-scène:** The two houses are central to the film's meaning. The Kims live in a cramped, semi-basement apartment where they struggle for a Wi-Fi signal. The Parks live in a stunning, minimalist architectural masterpiece. The verticality (stairs, basements) is a constant visual metaphor for the class hierarchy.",
                           "   - **Narrative & Genre:** The film is a masterclass in genre-bending. It begins as a black comedy/heist film, then abruptly shifts into a tense thriller, and finally explodes into horrific violence before ending as a tragedy.",
                           "**Meaning & Response:**",
                           "   - The film is a powerful allegory for the brutality of modern capitalism. The title 'Parasite' is ambiguous: are the poor Kims the parasites, feeding off the wealthy Parks? Or are the rich Parks the true parasites, living off the labour of the working class? The film suggests that this symbiotic but destructive relationship is the essence of the capitalist system, and that class conflict is ultimately inescapable."
                        ]
                    },
                ]
            },
            {
                id: 'p2-sB',
                title: 'Section B: Documentary film',
                films: [
                    {
                        id: 'amy', title: 'Amy', director: 'Asif Kapadia', year: 2015, imageUrl: 'https://i.pinimg.com/1200x/98/0b/64/980b6468b581bc7104aacff04129f7fe.jpg',
                        synopsis: 'A biographical documentary that chronicles the life and tragic death of British singer-songwriter Amy Winehouse, using extensive unseen archival footage and unheard tracks.',
                        keyFacts: { context: 'British Documentary', 'Specialist Study': 'Critical Debates & Filmmakers\' Theories' },
                        revisionNotes: [
                           "**Context:**",
                           "   - Released a few years after Winehouse's death, the film tapped into a public fascination with her life and the '27 Club'. It examines the devastating impact of modern celebrity, media intrusion, and addiction.",
                           "**Filmmakers' Theories (Asif Kapadia's Auteur Style):**",
                           "   - Kapadia has a distinct documentary style that avoids traditional 'talking head' interviews and retrospective narration. He constructs his films entirely from **archival footage** (home videos, concert footage, paparazzi clips) and uses audio-only interviews with friends and family, which play over the top.",
                           "   - This innovative technique creates a very immersive, intimate, and present-tense experience. The spectator feels like they are living through the events with Amy, rather than being told about them after the fact. Her own lyrics are displayed on screen, used as a primary text to reveal her inner thoughts.",
                           "**Analysis of 3 Key Scenes:**",
                           "   - **1. Early Home Videos:** The film opens with footage of a young, healthy, and happy Amy singing 'Happy Birthday'. This establishes a tragic contrast with the figure she would become.",
                           "   - **2. The 'Rehab' Recording:** We see footage of Amy recording the song 'Rehab', juxtaposed with audio interviews explaining that at the time, she genuinely didn't feel she needed to go. This highlights the tragic irony of her most famous song.",
                           "   - **3. The Grammy Awards:** Amy wins a Grammy but appears disconnected and unhappy. The scene powerfully shows that even at the peak of her professional success, she was deeply unwell.",
                           "**Specialist Study Area: Critical Debates:**",
                           "   - **The Significance of Digital Technology:** The film would be impossible to make without the proliferation of digital cameras, mobile phones, and the internet. It is constructed from hundreds of hours of personal and public digital footage, raising questions about modern celebrity and the constant surveillance of public figures.",
                           "   - **Ethics of Documentary:** The film was controversial. Is it ethical to use someone's private home videos to tell their story after their death? Does the film itself become another form of media exploitation, similar to the paparazzi it critiques? The spectator is made complicit in this voyeurism, as we are watching the very footage that documents her decline and are forced to confront our own role in consuming celebrity tragedy."
                        ]
                    },
                     {
                        id: 'stories-we-tell', title: 'Stories We Tell', director: 'Sarah Polley', year: 2012, imageUrl: 'https://i.pinimg.com/736x/0a/f6/5a/0af65ad10203786372ebdda9ac5a3edd.jpg',
                        synopsis: 'Filmmaker Sarah Polley interviews her family to uncover the truth about her mother, who died when she was young, leading to a startling revelation about her own parentage.',
                        keyFacts: { context: 'Canadian Documentary', 'Specialist Study': 'Critical Debates & Filmmakers\' Theories' },
                        revisionNotes: [
                           "**Filmmakers' Theories (Performative & Reflexive Documentary):**",
                           "   - This is a highly **reflexive** documentary; it is a film about the process of making a film and the nature of storytelling itself. Polley is both the director and the central subject of the investigation.",
                           "**Critical Debates:**",
                           "   - **Fact vs. Fiction:** The film masterfully blurs the line between fact and fiction. Polley uses real interviews and archival family photos, but she also uses 'fake' Super 8 home video footage, which she hired actors to create to look authentic. The moment this is revealed forces the spectator to question the 'truth' of everything they have seen. The film's central argument is that all family histories are a form of storytelling, a collection of subjective and often contradictory memories, and that an objective 'truth' is impossible to find."
                        ]
                    },
                    {
                        id: 'for-sama', title: 'For Sama', director: 'Waad Al-Kateab & Edward Watts', year: 2019, imageUrl: 'https://i.pinimg.com/736x/7c/16/82/7c168252d46078defd7d6446c952f111.jpg',
                        synopsis: 'A love letter from a young mother to her daughter, the film tells the story of Waad al-Kateab’s life through five years of the uprising in Aleppo, Syria as she falls in love, gets married and gives birth to Sama.',
                        keyFacts: { context: 'Syrian/British Documentary', 'Specialist Study': 'Critical Debates & Filmmakers\' Theories' },
                        revisionNotes: [
                           "**Filmmakers' Theories (Observational & Performative Documentary):**",
                           "   - The film is a powerful example of **observational** documentary, capturing the brutal reality of the Syrian civil war from a first-person perspective. The camera work is raw, handheld, and often shocking.",
                           "   - It is also a **performative** documentary. It is structured as a 'video diary' or 'love letter' from the filmmaker, Waad, to her young daughter, Sama. Her constant voiceover narration directly addresses Sama, explaining why she and her husband chose to stay in Aleppo. This makes the film deeply personal and emotional.",
                           "**Critical Debates:**",
                           "   - **Ethics & Spectatorship:** The film confronts the spectator with extremely graphic and distressing images of war, injury, and death, including the suffering of children. This raises profound ethical questions about the line between bearing witness and exploitation. It forces the Western viewer to confront a reality that is often sanitized by mainstream news media."
                        ]
                    },
                ]
            },
            {
                id: 'p2-sC',
                title: 'Section C: Film movements – Silent cinema',
                films: [
                    {
                        id: 'sunrise', title: 'Sunrise: A Song of Two Humans', director: 'F.W. Murnau', year: 1927, imageUrl: 'https://i.pinimg.com/1200x/7a/a4/64/7aa464786caef02d571231d1c073158a.jpg',
                        synopsis: 'A farmer is seduced by a sophisticated woman from the city who convinces him to drown his wife. After he fails to go through with it, he and his wife rediscover their love during a trip to the city.',
                        keyFacts: { context: 'Silent Film / German Expressionism in Hollywood', 'Specialist Study': 'Critical Debates' },
                        revisionNotes: [
                           "**Context & Film Movement:**",
                           "   - Directed by F.W. Murnau, a leading figure of the German Expressionist movement, but produced by Fox Studios in Hollywood. The film blends European artistic sensibility with American production values, representing a key moment in film history.",
                           "   - **German Expressionism** was a movement characterized by stylized, non-naturalistic visuals designed to represent inner psychological states like fear, desire, and madness. This is seen in the film's exaggerated sets, dramatic use of shadow, and dreamlike sequences.",
                           "**Film Form Analysis:**",
                           "   - **Cinematography:** Murnau was famous for his innovative 'unchained camera'. The film uses long, fluid tracking shots that were revolutionary for the time, freeing the camera from its static position and creating a more immersive, dreamlike experience. He also makes extensive use of superimposition to visualize characters' thoughts and fears.",
                           "   - **Mise-en-scène:** The sets are deliberately artificial and distorted to reflect the characters' emotions. The city is a dazzling, chaotic wonderland, while the countryside is a place of both idyllic nature and dark temptation.",
                           "**Analysis of 3 Key Scenes:**",
                           "   - **1. The Man Walks to Meet the Woman from the City:** A famous long tracking shot follows the man through a swamp. The mise-en-scène is nightmarish and expressionistic, representing his moral corruption.",
                           "   - **2. The Boat Trip:** The Man takes his Wife out on a boat, intending to drown her. The acting is highly expressive; his guilt and her terror are conveyed entirely through body language and facial expressions.",
                           "   - **3. The City Sequence:** After reconciling, the couple's trip to the city is a joyous montage of modern life, full of energy and wonder, symbolizing the rebirth of their love.",
                           "**Specialist Study Area: Critical Debates (The Realist vs. The Expressive):**",
                           "   - *Sunrise* is a key text in this debate. It is not trying to be 'realistic'. The characters are universal archetypes (The Man, The Wife), and the world is stylized. The film is fundamentally **expressive**, using the full visual potential of cinema to convey emotion and psychology. Murnau's 'unchained camera' and expressionist designs are techniques that prioritize artistic expression over realist representation."
                        ]
                    },
                    {
                        id: 'man-with-a-movie-camera', title: 'Man with a Movie Camera', director: 'Dziga Vertov', year: 1928, imageUrl: 'https://i.pinimg.com/736x/6b/e2/66/6be26697a55b6f42d3840cdf686b5d6b.jpg',
                        synopsis: 'An experimental documentary that presents a day in the life of a Soviet city, using a dazzling array of cinematic techniques to celebrate the modernity of the new communist state.',
                        keyFacts: { context: 'Soviet Montage Movement / Experimental Documentary', 'Specialist Study': 'Critical Debates' },
                        revisionNotes: [
                            "**Context & Film Movement:**",
                            "   - A key film of the **Soviet Montage** movement. After the Russian Revolution, filmmakers like Vertov and Eisenstein explored how editing (montage) could be used as a tool for propaganda and to create new ideas.",
                            "   - Vertov's 'Kino-Eye' theory argued that the camera lens was a machine that could see the world more perfectly than the human eye. He rejected fictional storytelling as 'bourgeois' and wanted to create a new form of cinema based on capturing 'life as it is'.",
                            "**Film Form:**",
                            "   - **Editing:** The film is a masterpiece of experimental editing. It has no story or actors, and is instead structured like a symphony. It uses fast-paced montage, split screens, slow motion, fast motion, and freeze frames to create a dynamic and exhilarating portrait of the city.",
                            "**Specialist Study Area: Critical Debates (The Realist vs. The Expressive):**",
                            "   - The film exists on both sides of this debate. On one hand, Vertov claimed he was capturing reality ('life unawares'). The footage is of real people in a real city. On the other hand, the film is intensely **expressive** and self-reflexive. It constantly shows the cameraman filming and the editor cutting the film. It is not a transparent window onto reality; it is a film that celebrates its own construction and the power of cinema to transform reality. It is a 'realist' film made with highly 'expressive' techniques."
                        ]
                    },
                ]
            },
            {
                id: 'p2-sD',
                title: 'Section D: Film movements – Experimental film (1960-2001)',
                films: [
                    {
                        id: 'memento', title: 'Memento', director: 'Christopher Nolan', year: 2000, imageUrl: 'https://i.pinimg.com/736x/0a/4b/6f/0a4b6fda11ae06e6306bbdfac1c34bc4.jpg',
                        synopsis: 'A man suffering from anterograde amnesia, unable to form new memories, uses a system of Polaroids and tattoos to hunt for the man he believes killed his wife.',
                        keyFacts: { context: 'Postmodern / Independent Film', 'Specialist Study': 'Narrative & Auteur' },
                        revisionNotes: [
                           "**Context:**",
                           "   - A low-budget independent film that became a cult classic and launched Christopher Nolan's career. It is a key example of postmodern filmmaking at the turn of the millennium.",
                           "**Film Form Analysis:**",
                           "   - **Sound:** The sound design is crucial for distinguishing the two timelines. The black-and-white scenes have a more documentary-like, diegetic sound mix, while the colour scenes have a more stylized, cinematic score.",
                           "**Analysis of 3 Key Scenes:**",
                           "   - **1. The Opening Scene:** A Polaroid picture 'un-develops'. The scene plays entirely in reverse, immediately establishing the film's central narrative conceit and disorienting the viewer.",
                           "   - **2. The 'Tattoo' Scenes:** Leonard uses his tattooed body as a permanent record of his investigation. These scenes visualize his unique method for creating a memory he can trust.",
                           "   - **3. The Final Scene (Chronologically the Middle):** The film's climax is the revelation that Leonard has been manipulating his own investigation. The final black-and-white scene merges with the colour timeline as Leonard decides to create a new 'truth' for himself by framing Teddy. It's a shocking twist that re-contextualizes the entire film.",
                           "**Character Analysis:**",
                           "   - **Leonard Shelby (Guy Pearce):** A classic unreliable narrator. His condition makes him unable to form new memories, but the film's climax reveals that he is also actively deceiving himself. He is not a noble avenger, but a man trapped in a self-created loop of revenge.",
                           "**Specialist Study Area: Narrative & Auteur:**",
                           "   - **Experimental Narrative:** The film's narrative structure is its most famous feature. It is split into two timelines: colour sequences told in reverse chronological order, and black-and-white sequences told in chronological order. This structure is not a gimmick; it is essential for placing the audience in the same state of confusion as the protagonist. It challenges conventional narrative structures and creates a unique spectator experience.",
                           "   - **Auteur (Christopher Nolan):** *Memento* established many of the thematic and stylistic signatures that would define Nolan's career: a fascination with time, memory, and identity; complex, non-linear narrative structures; a blending of art-house concepts with mainstream genre conventions (in this case, film noir); and an intellectual, puzzle-like quality."
                        ]
                    },
                     {
                        id: 'cleo-from-5-to-7', title: 'Cléo from 5 to 7', director: 'Agnès Varda', year: 1962, imageUrl: 'https://i.pinimg.com/736x/05/2c/16/052c16796deeb877d14f38adafedbfe2.jpg',
                        synopsis: 'A beautiful pop singer, Cléo, spends two hours wandering around Paris as she waits for the results of a medical test that may confirm she has cancer.',
                        keyFacts: { context: 'French New Wave', 'Specialist Study': 'Narrative & Auteur' },
                        revisionNotes: [
                            "**Context & Film Movement:**",
                            "   - A key film of the **French New Wave**, a movement that rejected the traditional conventions of Hollywood and embraced a more personal, experimental, and realistic style of filmmaking. The film was directed by Agnès Varda, one of the few female directors associated with the movement.",
                            "**Specialist Study Area: Narrative & Auteur:**",
                            "   - **Narrative:** The film's narrative unfolds in 'real time' (or close to it), a common experiment of the New Wave. It follows Cléo for two hours, creating a sense of immediacy. The narrative is not plot-driven but is structured around Cléo's internal, existential journey as she confronts her own mortality.",
                            "   - **Auteur (Agnès Varda):** Varda's authorial voice is clear. The film explores feminist themes, critiquing the way Cléo's identity has been defined by her beauty and how others see her (the male gaze). As she wanders Paris, she transforms from an object to be looked at into an active observer of the world, finding a new sense of self. Varda's blend of documentary-style realism with poetic subjectivity is a hallmark of her style."
                        ]
                    },
                ]
            }
        ]
    }
];


export const filmResourcesData: ResourceItem[] = [
    { id: '1', title: 'How to Analyse a Film Opening', overview: 'A quick guide to the key things to look for when analysing the opening sequence of a film, from cinematography to sound.', youtubeVideoId: 'Hrp2azKjGUI' },
    { id: '5', title: 'A Guide to Auteur Theory', overview: 'A comprehensive guide to understanding Auteur Theory, its origins with the French New Wave, and its application in film analysis.', youtubeVideoId: 'o_4hdA11Z-Q' },
    { id: '6', title: '5 Minute Film School: Editing', overview: 'A fast-paced introduction to the core principles of film editing, explaining how cuts, pacing, and rhythm shape a story.', youtubeVideoId: 'ctSBTjAWR2M' },
    { id: '7', title: 'Film Sound Explained', overview: 'An in-depth look at sound design, covering diegetic and non-diegetic sound, foley, and how audio shapes a viewer\'s emotional experience.', youtubeVideoId: 'ahHIifcFyqk' },
    { id: '9', title: 'Mise en Scène: An Introduction', overview: 'Learn the fundamentals of Mise en Scène, from set design and props to costume and lighting, and how it contributes to visual storytelling.', youtubeVideoId: 'cNRxdVhZbb8' },
    { id: '10', title: 'The History of Film', overview: 'A detailed overview of the key movements and technological innovations that have shaped the history of cinema from its inception to the modern day.', youtubeVideoId: 'zoj2nIulQDQ' },
];