import { fetchActiveBonds } from './lib/api';

async function testAPI() {
  console.log('Testing API integration...');
  
  try {
    console.log('Fetching active bonds...');
    const bonds = await fetchActiveBonds();
    console.log('Active bonds:', bonds);
    console.log('Number of bonds:', bonds.length);
    
    if (bonds.length === 0) {
      console.log('No active bonds found. This is expected as the server returns an empty array.');
    }
    
    console.log('API integration test completed successfully!');
  } catch (error) {
    console.error('Error testing API integration:', error);
  }
}

// Run the test
testAPI(); 