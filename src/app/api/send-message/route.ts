import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export const POST = async (req: Request) => {
  await dbConnect();
  const { username, content } = await req.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        { success: false, message: "User not accepting messages" },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as Message);

    await user.save();

    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error sending message", err);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};
