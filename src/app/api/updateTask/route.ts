export const PUT = async (request: Request) => {
    try {
      const id = request.headers.get('id'); // Use .get() for headers in Next.js 13
    
      const { title, description, dueDate, priority, status } = await request.json();
      const response = await fetch(`https://pcl-backend-pi.vercel.app/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, dueDate, status, priority }), // Include priority in the request body
      });
  
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error: any) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
  };
  