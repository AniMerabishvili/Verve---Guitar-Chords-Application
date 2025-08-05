const bcrypt = require('bcryptjs');

module.exports = {
    up: async (models) => {
        const { Song, User } = models;

        // Find an admin user to assign as uploader
        let adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            // Create a default admin if none exists
            adminUser = await User.create({
                firstName: "Admin",
                lastName: "User",
                userName: "admin",
                email: "admin@guitarchords.com",
                password: await bcrypt.hash("admin123", 10),
                role: "admin"
            });
        }

        // Sample songs with better chord notation formatting
        const songsWithChords = [
            {
                title: "Wonderwall - Oasis",
                lyrics: `Intro: [Em7] [G] [D] [C] x2

Verse 1:
[Em7]Today is gonna be the day that they're [G]gonna throw it back to [D]you [C]
[Em7]By now you should've somehow real[G]ized what you gotta [D]do [C]
[Em7]I don't believe that [G]anybody [D]feels the way I [C]do about you [D]now

Verse 2:
[C]Backbeat, the [D]word is on the [Em7]street that [G]fire in your [C]heart is out
[C]I'm sure you've [D]heard it all be[Em7]fore, but you [G]never really had a [C]doubt
[C]I don't believe that [D]anybody [Em7]feels the way I [C]do about you [D]now

Pre-Chorus:
And [C]all the roads we [D]have to walk are [Em7]winding
And [C]all the lights that [D]lead us there are [Em7]blinding
[C]There are many [D]things that I would [G]like to [D/F#]say to [Em7]you
But I don't know [C]how

Chorus:
Because [C]maybe [Em7]you're gonna be the one that [G]saves me
And [C]after [Em7]all [G]you're my wonder[C]wall
Because [C]maybe [Em7]you're gonna be the one that [G]saves me
And [C]after [Em7]all [G]you're my wonder[C]wall`,
                status: 1,
                uploadedBy: adminUser._id,
                uploadedByUsername: adminUser.userName
            },
            {
                title: "House of the Rising Sun - The Animals",
                lyrics: `Intro: [Am] [C] [D] [F] [Am] [C] [E] [Am]

Verse 1:
[Am]There [C]is a [D]house in [F]New Orleans
[Am]They [C]call the [E]Rising [Am]Sun
[Am]And it's [C]been the [D]ruin of [F]many a poor [Am]boy
And [C]God, I [E]know I'm [Am]one

Verse 2:
[Am]My [C]mother [D]was a [F]tailor
[Am]She [C]sewed my [E]new blue [Am]jeans
[Am]My [C]father [D]was a [F]gamblin' [Am]man
[C]Down in [E]New Or[Am]leans

Verse 3:
[Am]Now the [C]only [D]thing a [F]gambler [Am]needs
Is a [C]suitcase [E]and a [Am]trunk
[Am]And the [C]only [D]time he's [F]satis[Am]fied
Is [C]when he's [E]all drunk [Am]

Verse 4:
[Am]Oh [C]mother, [D]tell your [F]children
[Am]Not to [C]do what [E]I have [Am]done
[Am]Spend your [C]lives in [D]sin and [F]mise[Am]ry
In the [C]House of [E]the Rising [Am]Sun`,
                status: 1,
                uploadedBy: adminUser._id,
                uploadedByUsername: adminUser.userName
            },
            {
                title: "No Woman No Cry - Bob Marley",
                lyrics: `Intro: [C] [G/B] [Am] [F] [C] [F] [C] [G]

Chorus:
[C]No woman, no [G/B]cry [Am] [F]
[C]No woman, no [F]cry [C] [G]
[C]No woman, no [G/B]cry [Am] [F]
[C]No woman, no [F]cry [C] [G]

Verse 1:
[C]Said I re[G/B]member [Am]when we used to [F]sit
[C]In the govern[G/B]ment yard in [Am]Trench[F]town [C] [G]
[C]Oba [G/B]oba serv[Am]ing the hypo[F]crites
[C]As they would [G/B]mingle with the [Am]good people we [F]meet [C] [G]

Bridge:
[C]Good friends we [G/B]have, oh [Am]good friends we've [F]lost
A[C]long the [F]way [C] [G]
[C]In this great [G/B]future [Am]you can't for[F]get your past
[C]So dry your [F]tears I [C]say [G]

Chorus:
[C]No woman, no [G/B]cry [Am] [F]
[C]No woman, no [F]cry [C] [G]
[C]No woman, no [G/B]cry [Am] [F]
[C]No woman, no [F]cry [C] [G]`,
                status: 1,
                uploadedBy: adminUser._id,
                uploadedByUsername: adminUser.userName
            },
            {
                title: "Horse with No Name - America",
                lyrics: `Intro: [Em] [D6add9] x4

Verse 1:
[Em]On the first part of the [D6add9]journey
[Em]I was looking at all the [D6add9]life
[Em]There were plants and birds and [D6add9]rocks and things
[Em]There was sand and hills and [D6add9]rings

[Em]The first thing I met was a [D6add9]fly with a buzz
[Em]And the sky with no [D6add9]clouds
[Em]The heat was hot and the [D6add9]ground was dry
[Em]But the air was full of [D6add9]sound

Chorus:
[Em]I've been through the desert on a [D6add9]horse with no name
[Em]It felt good to be out of the [D6add9]rain
[Em]In the desert you can re[D6add9]member your name
[Em]'Cause there ain't no one for to [D6add9]give you no pain

[Em]La la [D6add9]la la la la [Em]la la [D6add9]la
[Em]La la [D6add9]la la la la [Em]la la [D6add9]la

Verse 2:
[Em]After two days in the [D6add9]desert sun
[Em]My skin began to turn [D6add9]red
[Em]After three days in the [D6add9]desert fun
[Em]I was looking at a river [D6add9]bed`,
                status: 1,
                uploadedBy: adminUser._id,
                uploadedByUsername: adminUser.userName
            }
        ];

        // Insert the new songs
        await Song.insertMany(songsWithChords);

        console.log(`✓ Added ${songsWithChords.length} songs with proper chord formatting`);
    },

    down: async (models) => {
        const { Song } = models;
        
        // Remove the songs we added (by title)
        const songTitles = [
            "Wonderwall - Oasis",
            "House of the Rising Sun - The Animals", 
            "No Woman No Cry - Bob Marley",
            "Horse with No Name - America"
        ];
        
        await Song.deleteMany({ title: { $in: songTitles } });
        console.log('✓ Removed songs with chord notations');
    }
}; 