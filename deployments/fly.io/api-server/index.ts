import { Client } from '@elastic/elasticsearch';
import http from 'http';

// Config
const ES_NODE = process.env.ELASTICSEARCH_NODE || 'http://localhost:9200';
const INDEX_NAME = 'classic-books';
const PORT = process.env.PORT || 3000;

const client = new Client({ node: ES_NODE });

// Creates the index and seeds it with some classic books if it doesn't exist.
async function seedData() {
  console.log(`Index "${INDEX_NAME}" not found. Seeding new data...`);

  await client.indices.create({
    index: INDEX_NAME,
    body: {
      mappings: {
        properties: {
          title: { type: 'text' },
          author: { type: 'keyword' },
          year: { type: 'integer' },
        }
      }
    }
  });

  const library = [
    { id: 1, title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937 },
    { id: 2, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', year: 1954 },
    { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813 },
    { id: 4, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
    { id: 5, title: '1984', author: 'George Orwell', year: 1949 },
  ];

  const body = library.flatMap(doc => [{ index: { _index: INDEX_NAME, _id: doc.id.toString() } }, doc]);

  const { body: bulkResponse } = await client.bulk({ refresh: true, body });

  if (bulkResponse.errors) {
    console.error('Bulk indexing failed:', bulkResponse.errors);
  } else {
    console.log(`${library.length} documents indexed into "${INDEX_NAME}".`);
  }
}

// Set up the HTTP server to handle requests.
const server = http.createServer(async (req, res) => {
  // We only care about GET requests to /api/books
  if (req.url === '/api/books' && req.method === 'GET') {
    try {
      const { body: searchResponse } = await client.search({
        index: INDEX_NAME,
        body: {
          query: {
            match_all: {},
          },
        },
      });

      // We just want the document source, not all the elasticsearch metadata.
      const books = searchResponse.hits.hits.map((hit: any) => hit._source);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(books));

    } catch (error) {
      console.error('Search query failed', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Something went wrong.' }));
    }
  } else {
    // Handle all other routes with a 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});


// This is what kicks the whole thing off.
async function startup() {
  try {
    // Make sure we can connect to elastic first.
    console.log('Connecting to Elasticsearch...');
    await client.ping();
    console.log('Successfully connected.');

    // Check if our index exists, and if not, create it.
    const { body: indexExists } = await client.indices.exists({ index: INDEX_NAME });
    if (!indexExists) {
      await seedData();
    } else {
      console.log(`Found existing index: "${INDEX_NAME}".`);
    }

    // Finally, start listening for http requests.
    server.listen(PORT, () => {
      console.log(`\nServer is running on http://localhost:${PORT}`);
      console.log(`Book data available at http://localhost:${PORT}/api/books`);
    });

  } catch (error) {
    console.error('Well, that didn\'t work. Script has to exit:');
    console.error(error);
    process.exit(1);
  }
}

startup();
