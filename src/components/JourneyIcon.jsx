export default function JourneyIcon({ type }) {
  return (
    <svg
      className="journey-icon"
      viewBox="0 0 144 144"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {type === 2 && (
        <>
          <path d="M31 29v27c0 27 42 27 42 0V29M27 28h9M68 28h9M52 77v20c0 27 47 27 47-1v-6" />
          <circle cx="99" cy="81" r="10" />
          <circle cx="99" cy="81" r="3" strokeWidth="2" />
          <path
            d="M96 23l20 7v15c0 13-10 22-20 27-10-5-20-14-20-27V30z"
            fill="currentColor"
            fillOpacity=".07"
          />
          <path d="M96 36v20M86 46h20" />
        </>
      )}
      {type === 3 && (
        <>
          <path
            d="M21 74c2-23 26-38 54-37 16 0 24 7 44 8 8 1 9 9 4 18-7 14-25 18-40 19-11 1-20 7-26 17-7 12-20 18-28 10-7-6-9-20-8-35z"
            fill="currentColor"
            fillOpacity=".06"
          />
          <path d="M77 40c-2 14-6 22-14 29M29 76c12-12 23-18 35-20" />
          <path
            d="M80 98l20-7 19 17M100 91l6-17M100 91l-4 25"
            strokeWidth="2"
          />
          <circle cx="80" cy="98" r="5" fill="currentColor" fillOpacity=".12" />
          <circle cx="100" cy="91" r="6" />
          <circle cx="119" cy="108" r="5" />
          <circle cx="106" cy="74" r="4" />
          <circle cx="96" cy="116" r="4" />
        </>
      )}
      {type === 4 && (
        <>
          <path
            d="M33 20h57l24 25v76H33z"
            fill="currentColor"
            fillOpacity=".06"
          />
          <path d="M90 20v26h24M46 37h27M46 49h18M46 107h17M99 107h3" />
          <path d="M52 78l19-14 23 17-18 17zM94 81l10-20" strokeWidth="2" />
          <circle cx="52" cy="78" r="5" />
          <circle cx="71" cy="64" r="5" />
          <circle cx="94" cy="81" r="5" />
          <circle cx="76" cy="98" r="4" />
          <circle cx="104" cy="61" r="3" />
        </>
      )}
    </svg>
  );
}
