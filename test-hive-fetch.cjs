const { Client } = require('@hiveio/dhive');

const client = new Client([
    'https://api.hive.blog',
    'https://api.deathwing.me',
    'https://hive-api.arcange.eu',
]);

async function fetchTag() {
    console.log('Fetching tasks for tag: datacomb33');
    try {
        const discussions = await client.database.getDiscussions('created', {
            tag: 'datacomb33',
            limit: 20,
        });

        console.log(`Found ${discussions.length} discussions`);

        discussions.forEach(d => {
            console.log('---');
            console.log('Title:', d.title);
            console.log('Author:', d.author);
            console.log('Permlink:', d.permlink);
            console.log('Created:', d.created);
            console.log('Tags:', JSON.parse(d.json_metadata).tags);
        });
    } catch (e) {
        console.error('Error:', e);
    }
}

fetchTag();
