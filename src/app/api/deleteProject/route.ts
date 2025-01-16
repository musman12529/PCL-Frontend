export const DELETE = async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
  
    if (!id) {
      return new Response(JSON.stringify({ message: 'Project ID is required' }), { status: 400 });
    }
  
    try {
      const response = await fetch(`https://pcl-backend-pi.vercel.app/api/projects/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
  
      return new Response(JSON.stringify({ message: 'Project deleted successfully' }), {
        status: 200,
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
  };
  