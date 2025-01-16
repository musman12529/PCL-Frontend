export const DELETE = async (request: Request) => {
    try {
      const id = request.headers.get('id'); // Use .get() for headers in Next.js 13

      
  
      // Call the backend Express API to delete the task
      const response = await fetch(`https://pcl-backend-pi.vercel.app/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
  
      return new Response(JSON.stringify({ message: 'Task deleted successfully' }), {
        status: 200,
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
  };
  