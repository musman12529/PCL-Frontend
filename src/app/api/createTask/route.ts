export const POST = async (request: Request) => {
    try {
      const { title, description, dueDate, priority } = await request.json(); // Extract task details including priority
      const projectId = request.headers.get('project-id'); // Use .get() for headers in Next.js 13
      if (!projectId) {
        return new Response(JSON.stringify({ message: 'User email is required' }), {
          status: 400,
        });
      }
  
      // Call the backend Express API to create a new task
      const response = await fetch('https://pcl-backend-pi.vercel.app/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'project-id': projectId,
        },
        body: JSON.stringify({ title, description, dueDate, priority }), // Include priority in the request body
      });
  
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 201 });
    } catch (error: any) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
  };