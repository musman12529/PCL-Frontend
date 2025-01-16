export const GET = async (request: Request) => {
    try {
      const userEmail = request.headers.get('user-email');
  
      if (!userEmail) {
        return new Response(JSON.stringify({ message: 'User email is required' }), { status: 400 });
      }
  
      const response = await fetch('https://pcl-backend-pi.vercel.app/api/projects', {
        headers: {
          'user-email': userEmail,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error: any) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
  };
  