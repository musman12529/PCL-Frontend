import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  // Destructure the username, email, and password from the request body
  const { username, email, password } = await request.json();
  
  try {
    // Make a POST request to the backend with username, email, and password
    const response = await fetch("https://pcl-backend-pi.vercel.app/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }), // Pass username, email, and password
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new NextResponse(errorText, { status: response.status });
    }

    // Handle successful registration response
    const data = await response.json();
    return new NextResponse(data.message, { status: 200 });

  } catch (err) {
    // Catch any errors during the process and return a generic server error message
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
