import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * The same mark as `icon.tsx`, at the size iOS home screens want. It doubles as
 * the Organization logo in the structured data, which needs at least 112px.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0c0d",
        }}
      >
        <svg width="158" height="158" viewBox="0 0 28 28" fill="none">
          <path
            d="M7 19.5 L11.5 19.5 L11.5 13 L16.5 13 L16.5 8.5 L20 8.5"
            stroke="#f2f2f3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7" cy="19.5" r="2.2" fill="#f2f2f3" />
          <rect x="17.4" y="5.9" width="5.2" height="5.2" rx="1.5" fill="#34c799" />
        </svg>
      </div>
    ),
    size,
  );
}
