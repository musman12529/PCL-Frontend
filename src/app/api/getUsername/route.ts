export const GET = async (request: Request) => {
    try {
      const userEmail = request.headers.get('user-email'); // Get user email from headers
  
      // Validate that the user email is provided
      if (!userEmail) {
        return new Response(
          JSON.stringify({ message: 'User email is required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Call the backend Express API to retrieve the username
      const response = await fetch('https://pcl-backend-pi.vercel.app/api/users/username', {
        method: 'GET',
        headers: {
          'user-email': userEmail,
        },
      });
  
      // Check if the backend response is successful
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to fetch username');
      }
  
      // Parse the successful response
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error: any) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  };
  