const fetch = require('node-fetch');

async function test() {
  const query = "machine learning";
  try {
    const response = await fetch(`https://api.crossref.org/works?query=${encodeURIComponent(query)}&select=title,abstract,author,issued,URL&rows=2`);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}

test();
