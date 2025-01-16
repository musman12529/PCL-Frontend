export const PUT = async (request: Request) => {
    try {
      const id = request.headers.get('id'); // Get the project ID from the headers
      if (!id) {
        return new Response(JSON.stringify({ message: 'Project ID is required' }), { status: 400 });
      }
  
      const { projectName, status, dueDate, assignedTo } = await request.json();
  
      // Construct the body with only the fields provided
      const body: Record<string, any> = {};
      if (projectName) body.projectName = projectName;
      if (status) body.status = status;
      if (dueDate) body.dueDate = dueDate;
      if (assignedTo) body.assignedTo = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
  
      // Make the PUT request to the backend API
      const response = await fetch(`https://pcl-backend-pi.vercel.app/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update project');
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error: any) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
  };
  