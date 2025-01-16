export const GET = async (request: Request) => {
    try {
      const userEmail = request.headers.get('user-email'); // Get user email from headers
  
      // Validate that the user email is provided
      if (!userEmail) {
        return new Response(
          JSON.stringify({ message: 'User email is required' }),
          { status: 400 }
        );
      }
  
      // Call the backend Express API to retrieve teammates
      const response = await fetch('https://pcl-backend-pi.vercel.app/api/teammates', {
        method: 'GET',
        headers: {
          'user-email': userEmail,
        },
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to fetch teammates');
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error: any) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
  };
  