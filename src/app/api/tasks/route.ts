// pages/api/tasks/overdue.ts


export const GET = async (request: Request) => {
  try {
    const projectId = request.headers.get('project-id'); // Use .get() for headers in Next.js 13
    if (!projectId) {
      return new Response(JSON.stringify({ message: 'Project ID is required' }), {
        status: 400,
      });
    }

    // Call the backend Express API
    const response = await fetch('https://pcl-backend-pi.vercel.app/api/tasks/', {
      method: 'GET',
      headers: {
        'project-id': projectId,
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
