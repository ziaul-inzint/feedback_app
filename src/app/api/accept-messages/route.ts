import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export const POST = async (req: Request) => {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user;

  if (!session || !session?.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 400 }
    );
  }

  const userId = user?._id;

  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messages",
        },
        { status: 401 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message accepting status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Failed to update user status to accept messages", err);
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user = session?.user;

  if (!session || !session?.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 400 }
    );
  }

  const userId = user?._id;
  try {
    const foundUser = await UserModel.findById(userId);

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "",
        isAcceptingMessages: foundUser?.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Failed to update user status to accept messages", err);
    return Response.json(
      {
        success: false,
        message: "Error in getting message acceptance status",
      },
      { status: 500 }
    );
  }
};
