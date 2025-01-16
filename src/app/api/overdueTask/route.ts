export const GET = async (request: Request) => {
    try {
      const userEmail = request.headers.get('user-email');
      if (!userEmail) {
        return new Response(JSON.stringify({ message: 'User email is required' }), {
          status: 400,
        });
      }
  
      // Call the backend Express API for overdue tasks
      const response = await fetch('https://pcl-backend-pi.vercel.app/api/tasks/overdue', {
        method: 'GET',
        headers: {
          'user-email': userEmail,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch overdue tasks from backend');
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error: any) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
  };
  