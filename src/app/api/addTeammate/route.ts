export const POST = async (request: Request) => {
    try {
      const { teammateEmail } = await request.json(); // Extract the teammate email from the request body
      const userEmail = request.headers.get('user-email'); // Get user email from headers
  
      // Validate the presence of required fields
      if (!userEmail || !teammateEmail) {
        return new Response(
          JSON.stringify({ message: 'User email and teammate email are required' }),
          { status: 400 }
        );
      }
  
      // Call the backend Express API to add a new teammate
      const response = await fetch('https://pcl-backend-pi.vercel.app/api/teammates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-email': userEmail,
        },
        body: JSON.stringify({ teammateEmail }),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Email Does Not Exist');
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 201 });
    } catch (error: any) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
  };
  