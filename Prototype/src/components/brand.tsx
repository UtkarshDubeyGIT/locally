export function Brand() {
  return (
    <span className="brand__lockup">
      <svg
        className="brand__mark"
        viewBox="0 0 64 64"
        aria-hidden="true"
        focusable="false"
      >
        <rect width="64" height="64" rx="15" fill="currentColor" />
        <g className="brand__bars">
          <rect x="13" y="33" width="10" height="18" rx="5" />
          <rect x="27" y="23" width="10" height="28" rx="5" />
          <rect x="41" y="13" width="10" height="38" rx="5" />
        </g>
      </svg>
      <span>Locally</span>
    </span>
  );
}
