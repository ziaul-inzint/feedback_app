import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const DELETE = async (
  req: Request,
  { params }: { params: { messageId: string } }
) => {
  const messageId = params?.messageId;

  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user;

  if (!session || !session?.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 400 }
    );
  }

  try {
    const updatedRes = await UserModel.updateOne(
      { _id: user?._id },
      {
        $pull: { messages: { _id: messageId } },
      }
    );

    if (updatedRes.modifiedCount == 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }
    return Response.json(
      { success: true, message: "Message deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in delete mesage", error);
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
