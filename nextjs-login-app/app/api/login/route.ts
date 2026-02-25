import { NextRequest, NextResponse } from "next/server";

// Valid credentials loaded from environment variables
// Format: USERNAME1:PASSWORD1,USERNAME2:PASSWORD2
function getValidUsers(): Array<{ username: string; password: string }> {
  const credentials = process.env.LOGIN_CREDENTIALS || "";
  if (!credentials) return [];
  return credentials.split(",").map((pair) => {
    const idx = pair.indexOf(":");
    const username = pair.substring(0, idx);
    const password = pair.substring(idx + 1);
    return { username, password };
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    const validUsers = getValidUsers();
    const user = validUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      return NextResponse.json(
        { message: "Login successful", user: { username: user.username } },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Invalid username or password" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { message: "Invalid request" },
      { status: 400 }
    );
  }
}
