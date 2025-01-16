export const POST = async (request: Request) => {
    try {
      const { projectName, status, dueDate, assignedTo } = await request.json();
      const userEmail = request.headers.get('user-email');
  
      if (!userEmail) {
        return new Response(JSON.stringify({ message: 'User email is required' }), { status: 400 });
      }
  
      const response = await fetch('https://pcl-backend-pi.vercel.app/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-email': userEmail,
        },
        body: JSON.stringify({ projectName, status, dueDate, assignedTo }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 201 });
    } catch (error: any) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
  };
  