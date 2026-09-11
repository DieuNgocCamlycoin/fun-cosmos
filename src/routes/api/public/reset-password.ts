import { createFileRoute } from "@tanstack/react-router";

const PLAYFAB_TITLE_ID = "1BA27B";

export const Route = createFileRoute("/api/public/reset-password")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secretKey = process.env["PLAYFAB_SECRET_KEY"];

        if (!secretKey) {
          return Response.json(
            { ok: false, message: "Máy chủ chưa được cấu hình khóa bảo mật." },
            { status: 500 },
          );
        }

        let payload: { password?: unknown; token?: unknown };
        try {
          payload = (await request.json()) as { password?: unknown; token?: unknown };
        } catch {
          return Response.json(
            { ok: false, message: "Dữ liệu yêu cầu không hợp lệ." },
            { status: 400 },
          );
        }

        const password = typeof payload.password === "string" ? payload.password : "";
        const token = typeof payload.token === "string" ? payload.token : "";

        if (password.length < 6 || password.length > 100) {
          return Response.json(
            { ok: false, message: "Mật khẩu cần tối thiểu 6 ký tự." },
            { status: 400 },
          );
        }

        if (!token || token.length > 512) {
          return Response.json(
            {
              ok: false,
              message:
                "Không tìm thấy mã đặt lại trong liên kết. Hãy mở lại liên kết trong email, hoặc yêu cầu gửi email mới.",
            },
            { status: 400 },
          );
        }

        try {
          const playFabResponse = await fetch(`https://${PLAYFAB_TITLE_ID}.playfabapi.com/Admin/ResetPassword`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-SecretKey": secretKey,
            },
            body: JSON.stringify({
              Password: password,
              Token: token,
            }),
          });

          const data = (await playFabResponse.json().catch(() => ({}))) as {
            error?: { message?: string };
            data?: unknown;
          };

          if (!playFabResponse.ok) {
            const errorMessage = data?.error?.message ?? "";
            const normalized = errorMessage.toLowerCase();

            if (normalized.includes("token")) {
              return Response.json(
                {
                  ok: false,
                  message:
                    "Liên kết đặt lại mật khẩu đã hết hạn hoặc không đúng. Vui lòng yêu cầu gửi lại email mới trong game.",
                },
                { status: 400 },
              );
            }

            return Response.json(
              {
                ok: false,
                message:
                  "Không thể đặt lại mật khẩu lúc này. Vui lòng thử lại hoặc yêu cầu gửi lại email mới.",
              },
              { status: 400 },
            );
          }

          return Response.json({ ok: true }, { status: 200 });
        } catch {
          return Response.json(
            { ok: false, message: "Mất kết nối tới máy chủ. Vui lòng kiểm tra mạng và thử lại." },
            { status: 503 },
          );
        }
      },
    },
  },
});
