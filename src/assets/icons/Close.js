export const Close = ({ ...props }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      {...props}
    >
      <title>{props.title || 'Close'}</title>
      <g id="Menu / Close_LG">
        <path
          id="Vector"
          d="M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001"
          stroke="gray"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};
