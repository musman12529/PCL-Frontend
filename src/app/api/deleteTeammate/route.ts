export const DELETE = async (request: Request) => {
    try {
      const teammateEmail = request.headers.get('teammate-email'); // Get the teammate email from headers
      const userEmail = request.headers.get('user-email'); // Get the user email from headers
  
      // Validate that both user email and teammate email are provided
      if (!userEmail || !teammateEmail) {
        return new Response(
          JSON.stringify({ message: 'User email and teammate email are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Call the backend Express API to delete the teammate
      const response = await fetch(`https://pcl-backend-pi.vercel.app/api/teammates/${teammateEmail}`, {
        method: 'DELETE',
        headers: {
          'user-email': userEmail, // Pass the user email in the header
          'Content-Type': 'application/json',
        },
      });
  
      // Check if the backend response is successful
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Failed to delete teammate');
      }
  
      return new Response(
        JSON.stringify({ message: 'Teammate deleted successfully' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (error: any) {
      return new Response(
        JSON.stringify({ message: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
  