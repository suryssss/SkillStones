export async function POST(req) {
    const { userId } = auth();
    const { content, stoneId } = await req.json();
  
    if (!userId) return new Response("Unauthorized", { status: 401 });
  
    const message = await prisma.message.create({
      data: {
        content,
        stoneId,
        senderId: userId,
      },
    });
  
    return Response.json(message);
  }
  