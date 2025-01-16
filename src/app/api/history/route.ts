export const GET = async (request: Request) => {
    try {
        const id = request.headers.get('id'); // Use .get() for headers in Next.js 13

  
      // Call the backend Express API for overdue tasks
      const response = await fetch(`https://pcl-backend-pi.vercel.app/api/tasks/history/${id}`, {
        method: 'GET',
        headers: {
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch tasks history from backend');
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error: any) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
  };